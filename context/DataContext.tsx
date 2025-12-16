import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { NewsItem, GalleryItem, Teacher } from '../types';
import { getApiUrl, API_BASE_URL } from '../services/firebase';

interface DataContextType {
  news: NewsItem[];
  gallery: GalleryItem[];
  teachers: Teacher[];
  addNews: (data: any) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;
  addGalleryItem: (data: any) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  addTeacher: (data: any) => Promise<void>;
  updateTeacher: (data: any) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;
  loading: boolean;
  refreshData: () => void;
  error: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper: Mengubah URL Google Drive menjadi Direct Link yang Valid untuk IMG Tag
  const fixGoogleDriveUrl = (url: any): string => {
    if (typeof url !== 'string') return '';
    if (!url) return '';
    
    // 1. Handle format dari Script User (lh3.googleusercontent.com/d/ID)
    if (url.includes('lh3.googleusercontent.com/d/')) {
        const parts = url.split('/d/');
        if (parts.length > 1) {
            const id = parts[1].split('/')[0];
            return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
        }
    }

    // 2. Handle format standar Drive (drive.google.com)
    if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
      const idMatch = url.match(/[-\w]{25,}/);
      if (idMatch) {
          return `https://drive.google.com/thumbnail?id=${idMatch[0]}&sz=w1000`;
      }
    }
    return url;
  };

  // Helper untuk normalisasi data dari Sheet
  const normalizeData = (data: any[]): any[] => {
    if (!Array.isArray(data)) return [];
    return data.map(item => {
      const newItem: any = {};
      
      let foundDriveUrl = '';
      Object.values(item).forEach((val: any) => {
          if (typeof val === 'string' && (val.includes('drive.google.com') || val.includes('lh3.googleusercontent.com'))) {
              foundDriveUrl = val;
          }
      });

      Object.keys(item).forEach(key => {
        const lowerKey = key.toLowerCase().trim();
        let value = item[key];

        // 1. Mapping Gambar/Foto
        if (lowerKey === 'image' || lowerKey === 'src' || lowerKey === 'foto' || lowerKey === 'gambar') {
            value = fixGoogleDriveUrl(value);
            newItem['image'] = value;
        } 
        // 2. Mapping Nama
        else if (lowerKey === 'name' || lowerKey === 'nama' || lowerKey === 'nama guru' || lowerKey === 'nama lengkap') {
            newItem['name'] = value;
        }
        // 3. Mapping Jabatan/Role
        else if (lowerKey === 'role' || lowerKey === 'jabatan' || lowerKey === 'posisi') {
            newItem['role'] = value;
        }
        // 4. Mapping Telepon
        else if (
            lowerKey === 'phone' || 
            lowerKey === 'hp' || 
            lowerKey === 'no hp' || 
            lowerKey === 'no. hp' || 
            lowerKey === 'no_hp' || 
            lowerKey === 'telp' || 
            lowerKey === 'no telp' || 
            lowerKey === 'wa' || 
            lowerKey === 'whatsapp' ||
            lowerKey === 'kontak'
        ) {
            newItem['phone'] = value;
        }
        // 5. Mapping NIP
        else if (lowerKey === 'nip' || lowerKey === 'nomor induk') {
            newItem['nip'] = value;
        }
        // 6. Mapping Kategori & Alt
        else if (lowerKey === 'kategori' || lowerKey === 'category') {
            newItem['category'] = value;
        }
        else if (lowerKey === 'keterangan' || lowerKey === 'deskripsi' || lowerKey === 'alt') {
            newItem['alt'] = value;
        }
        // 7. Mapping Tanggal (Format ke Indonesia)
        else if (lowerKey === 'date' || lowerKey === 'tanggal' || lowerKey === 'waktu') {
             if (typeof value === 'string' && (value.includes('T') || value.match(/^\d{4}-\d{2}-\d{2}/))) {
                 try {
                     const d = new Date(value);
                     if (!isNaN(d.getTime())) {
                         // Format: 14 Desember 2025
                         newItem['date'] = new Intl.DateTimeFormat('id-ID', {
                             day: 'numeric', month: 'long', year: 'numeric'
                         }).format(d);
                     } else {
                         newItem['date'] = value;
                     }
                 } catch (e) { newItem['date'] = value; }
             } else {
                 newItem['date'] = value;
             }
        }
        else {
            newItem[lowerKey] = value;
        }
      });

      if ((!newItem['image'] || !newItem['image'].includes('http')) && foundDriveUrl) {
          newItem['image'] = fixGoogleDriveUrl(foundDriveUrl);
      }
      
      if (!newItem.name && newItem.nama) newItem.name = newItem.nama;
      if (!newItem.role && newItem.jabatan) newItem.role = newItem.jabatan;
      if (!newItem.phone) {
          newItem.phone = newItem['hp'] || newItem['no hp'] || newItem['wa'] || newItem['telp'];
      }

      if (newItem.id) newItem.id = String(newItem.id);
      return newItem;
    });
  };

  const fetchData = useCallback(async () => {
    setError(null);

    if (API_BASE_URL.includes("PASTE_URL")) {
        console.warn("URL Google Script belum dipasang di services/firebase.ts");
        setLoading(false);
        return;
    }

    setLoading(true);
    const timestamp = new Date().getTime();

    try {
      // Fetch semua data secara paralel
      const [newsRes, galleryRes, teachersRes] = await Promise.all([
        fetch(`${getApiUrl('news')}&_t=${timestamp}`).then(res => res.json().catch(() => [])),
        fetch(`${getApiUrl('gallery')}&_t=${timestamp}`).then(res => res.json().catch(() => [])),
        fetch(`${getApiUrl('teachers')}&_t=${timestamp}`).then(res => res.json().catch(() => []))
      ]);

      // DETEKSI MASALAH SCRIPT GOOGLE (Jika backend return object 'active' bukan array)
      if (newsRes && !Array.isArray(newsRes) && newsRes.status === 'active') {
          throw new Error("SCRIPT GOOGLE BELUM LENGKAP: Anda perlu mengcopy kode Script baru (yang ada fungsi doGet dengan logika if/else) ke Apps Script Editor, lalu Deploy New Version.");
      }

      setNews(normalizeData(Array.isArray(newsRes) ? newsRes : []).reverse());
      setGallery(normalizeData(Array.isArray(galleryRes) ? galleryRes : []).reverse());
      setTeachers(normalizeData(Array.isArray(teachersRes) ? teachersRes : []));
      
    } catch (err: any) {
      console.error("Gagal mengambil data:", err);
      // Tampilkan error yang informatif di layar
      setError(err.message || "Gagal terhubung ke server. Pastikan koneksi internet stabil.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const postToSheet = async (payload: any) => {
      try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            redirect: 'follow',
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
            body: JSON.stringify(payload) 
        });
        
        if (!response.ok) {
            throw new Error('Gagal terhubung ke server (HTTP ' + response.status + ')');
        }
        
        const result = await response.json();
        
        if (result.status === 'error') {
            let msg = result.message || 'Terjadi kesalahan di server Google Script';
            if (msg.includes("openById") || msg.includes("SpreadsheetApp")) {
                msg = `SCRIPT ERROR: Backend gagal membaca Spreadsheet.\nPastikan ID Spreadsheet di kode Apps Script sudah: "1q6MXYWbaKULwLp2NSeNe2B_T5gmgsb2nfWcCJECLBKI"`;
            }
            // NEW: Deteksi error 'appendRow' null (Sheet missing)
            if (msg.includes("appendRow") || msg.includes("reading 'appendRow'")) {
                 msg = `SCRIPT ERROR: Tab Spreadsheet tidak ditemukan.\nScript otomatis perbaikan diperlukan. Silakan update kode 'Kode.gs' di Google Script Anda.`;
            }
            throw new Error(msg);
        }

        return result;
      } catch (error: any) {
          console.error("Error posting to sheet:", error);
          throw error;
      }
  };

  const addNews = async (data: any) => {
    await postToSheet({ ...data, action: 'news' });
    await fetchData(); 
  };

  const deleteNews = async (id: string) => {
      const originalData = [...news];
      setNews(prev => prev.filter(item => item.id !== id));
      try {
        await postToSheet({ action: 'delete', type: 'news', id: id });
      } catch (error: any) {
        setNews(originalData);
        alert("Gagal menghapus berita: " + error.message);
      }
  };

  const addGalleryItem = async (data: any) => {
    await postToSheet({ ...data, action: 'gallery' });
    await fetchData();
  };

  const deleteGalleryItem = async (id: string) => {
      const originalData = [...gallery];
      setGallery(prev => prev.filter(item => item.id !== id));
      try {
        await postToSheet({ action: 'delete', type: 'gallery', id: id });
      } catch (error: any) {
        setGallery(originalData);
        alert("Gagal menghapus foto: " + error.message);
      }
  };

  const addTeacher = async (data: any) => {
    await postToSheet({ ...data, action: 'teacher' });
    await fetchData();
  };

  const updateTeacher = async (data: any) => {
      await postToSheet({ ...data, action: 'edit_teacher' });
      await fetchData();
  }

  const deleteTeacher = async (id: string) => {
        const originalData = [...teachers];
        setTeachers(prev => prev.filter(item => item.id !== id));
        try {
            await postToSheet({ action: 'delete', type: 'teachers', id: id });
        } catch (error: any) {
            setTeachers(originalData);
            alert("Gagal menghapus data guru: " + error.message);
        }
  };

  return (
    <DataContext.Provider value={{ 
      news, 
      gallery, 
      teachers,
      addNews, 
      deleteNews, 
      addGalleryItem, 
      deleteGalleryItem, 
      addTeacher,
      updateTeacher,
      deleteTeacher,
      loading,
      refreshData: fetchData,
      error
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};