import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Trash2, Plus, Image, FileText, Lock, LogOut, Upload, Link as LinkIcon, Monitor, Loader2, Users, Pencil, RefreshCw, ImageOff, PlayCircle, ShieldAlert, Eye, EyeOff } from 'lucide-react';

// KONFIGURASI FOLDER DRIVE (Hanya satu folder default untuk gambar)
const DEFAULT_DRIVE_FOLDER_ID = "1_rWWi5si0Yg8UYbp4a338ghIdDfUgTa4"; 

export const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Toggle lihat password
  
  // Login Security State
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  const [activeTab, setActiveTab] = useState<'news' | 'gallery' | 'teachers'>('news');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State untuk Modal Konfirmasi Hapus
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, id: string, type: 'news'|'gallery'|'teachers' | null, title?: string}>({
      isOpen: false, id: '', type: null, title: ''
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [countdown, setCountdown] = useState(3);
  
  // State Upload
  const [imageInputMethod, setImageInputMethod] = useState<'file' | 'url'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const { 
      news, gallery, teachers,
      addNews, deleteNews, 
      addGalleryItem, deleteGalleryItem,
      addTeacher, updateTeacher, deleteTeacher,
      loading, refreshData
  } = useData();

  const [newsForm, setNewsForm] = useState({ title: '', date: '', excerpt: '', image: '' });
  const [galleryForm, setGalleryForm] = useState({ image: '', alt: '', category: 'Kegiatan' });
  const [teacherForm, setTeacherForm] = useState({ id: '', name: '', role: '', nip: '', phone: '', image: '' });
  
  const [isEditingTeacher, setIsEditingTeacher] = useState(false);

  // Helper Regex YouTube yang kuat (termasuk Shorts)
  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Reset file selection when switching tabs
  useEffect(() => {
      clearImageSelection();
  }, [activeTab]);

  // Lockout Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLocked && lockoutTimer > 0) {
        interval = setInterval(() => {
            setLockoutTimer((prev) => prev - 1);
        }, 1000);
    } else if (lockoutTimer === 0 && isLocked) {
        setIsLocked(false);
        setLoginAttempts(0); // Reset attempts after lockout
    }
    return () => clearInterval(interval);
  }, [isLocked, lockoutTimer]);

  const clearImageSelection = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setNewsForm(prev => ({ ...prev, image: '' }));
    setGalleryForm(prev => ({ ...prev, image: '' }));
    setTeacherForm(prev => ({ ...prev, image: '' }));
  };

  const handleEditTeacher = (teacher: any) => {
    setIsEditingTeacher(true);
    setTeacherForm({
      id: teacher.id,
      name: teacher.name,
      role: teacher.role,
      nip: teacher.nip || '',
      phone: teacher.phone || '',
      image: teacher.image || ''
    });
    setPreviewUrl(teacher.image || '');
    if (teacher.image) {
        setImageInputMethod('url');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditTeacher = () => {
    setIsEditingTeacher(false);
    setTeacherForm({ id: '', name: '', role: '', nip: '', phone: '', image: '' });
    clearImageSelection();
  };

  // --- SIMPLE SECURE LOGIN LOGIC ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) return;

    // Pengecekan Password Langsung (Case Sensitive)
    // Password: adminSDN3
    if (password === 'adminSDN3') {
      setIsAuthenticated(true);
      setLoginAttempts(0);
      setPassword(''); 
    } else {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      if (newAttempts >= 3) {
          setIsLocked(true);
          setLockoutTimer(30); // Lock for 30 seconds
          alert('Terlalu banyak percobaan gagal. Akses dikunci selama 30 detik.');
      } else {
          alert(`Password salah! Sisa percobaan: ${3 - newAttempts}`);
      }
      setPassword('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
          alert("Mohon upload file gambar (jpg, png).");
          e.target.value = '';
          return;
      }
      if (file.size > 5 * 1024 * 1024) { 
          alert(`Ukuran file terlalu besar (Max 5MB).`);
          e.target.value = '';
          return;
      }
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const convertBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => { resolve(fileReader.result as string); };
      fileReader.onerror = (error) => { reject(error); };
    });
  };

  const requestDelete = (id: string, type: 'news'|'gallery'|'teachers', title: string) => {
      setDeleteModal({ isOpen: true, id, type, title });
      setCountdown(3);
      setIsDeleting(false);
  };

  const executeDelete = async () => {
      if (!deleteModal.id || !deleteModal.type) return;
      setIsDeleting(true);
      for (let i = 3; i > 0; i--) {
        setCountdown(i);
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      setCountdown(0);

      if (deleteModal.type === 'news') await deleteNews(deleteModal.id);
      else if (deleteModal.type === 'gallery') await deleteGalleryItem(deleteModal.id);
      else if (deleteModal.type === 'teachers') await deleteTeacher(deleteModal.id);
      
      setDeleteModal({ isOpen: false, id: '', type: null, title: '' });
      setIsDeleting(false);
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageInputMethod === 'file' && !selectedFile) { alert("Mohon pilih file gambar."); return; }
    
    setIsSubmitting(true);
    try {
        let payload: any = { title: newsForm.title, date: newsForm.date, excerpt: newsForm.excerpt };
        if (imageInputMethod === 'file' && selectedFile) {
            payload.imageBase64 = await convertBase64(selectedFile);
            payload.folderId = DEFAULT_DRIVE_FOLDER_ID;
            payload.mimeType = selectedFile.type;
        } else {
            payload.image = newsForm.image;
        }
        await addNews(payload);
        setNewsForm({ title: '', date: '', excerpt: '', image: '' });
        clearImageSelection();
        alert('Berita berhasil dipublikasikan!');
    } catch(e: any) { alert(`Gagal upload: ${e.message}`); } finally { setIsSubmitting(false); }
  };

  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageInputMethod === 'file' && !selectedFile) { alert("Mohon pilih file."); return; }

    setIsSubmitting(true);
    try {
        let payload: any = { alt: galleryForm.alt, category: galleryForm.category };
        if (imageInputMethod === 'file' && selectedFile) {
             payload.imageBase64 = await convertBase64(selectedFile);
             payload.mimeType = selectedFile.type;
             payload.folderId = DEFAULT_DRIVE_FOLDER_ID;
        } else {
             payload.image = galleryForm.image;
        }
        await addGalleryItem(payload);
        setGalleryForm({ image: '', alt: '', category: 'Kegiatan' });
        clearImageSelection();
        alert('Berhasil!');
    } catch(e: any) { alert(`Gagal upload: ${e.message}`); } finally { setIsSubmitting(false); }
  };

  const handleTeacherSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
          let payload: any = { name: teacherForm.name, role: teacherForm.role, nip: teacherForm.nip, phone: teacherForm.phone, id: isEditingTeacher ? teacherForm.id : undefined };
          if (imageInputMethod === 'file' && selectedFile) {
              payload.imageBase64 = await convertBase64(selectedFile);
              payload.folderId = DEFAULT_DRIVE_FOLDER_ID;
              payload.mimeType = selectedFile.type;
          } else if (imageInputMethod === 'url') {
              payload.image = teacherForm.image;
          }
          if (isEditingTeacher) { await updateTeacher(payload); alert('Updated!'); setIsEditingTeacher(false); } 
          else { await addTeacher(payload); alert('Ditambahkan!'); }
          setTeacherForm({ id: '', name: '', role: '', nip: '', phone: '', image: '' });
          clearImageSelection();
      } catch(e: any) { alert(`Gagal: ${e.message}`); } finally { setIsSubmitting(false); }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
          <div className="flex justify-center mb-6 text-blue-600">
             {isLocked ? <ShieldAlert size={48} className="text-red-500 animate-pulse" /> : <Lock size={48} />}
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Admin Login</h2>
          
          {isLocked ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-center">
                  <p className="font-bold text-sm">Akses Dikunci Sementara</p>
                  <p className="text-xs mt-1">Terlalu banyak percobaan gagal.</p>
                  <p className="text-xl font-mono mt-2">{lockoutTimer}s</p>
              </div>
          ) : (
              <p className="text-slate-500 text-center mb-6 text-sm">Masukkan kredensial keamanan sekolah.</p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input 
                type={showPassword ? "text" : "password"}
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                disabled={isLocked}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed pr-10" 
                placeholder={isLocked ? "Terkunci..." : "••••••••"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-600"
                disabled={isLocked}
              >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button 
                type="submit" 
                disabled={isLocked || !password}
                className={`w-full font-bold py-2 px-4 rounded-lg transition ${
                    isLocked 
                    ? 'bg-slate-400 text-white cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
            >
                {isLocked ? 'Terkunci' : 'Masuk Dashboard'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
              <LinkIcon className="inline-block mr-1 w-3 h-3 text-slate-400" />
              <span className="text-xs text-slate-400">Secure Access Area</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Dashboard Admin</h1>
          <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition"><LogOut size={20} /> Logout</button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button onClick={() => setActiveTab('news')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${activeTab === 'news' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100'}`}><FileText size={20} /> Berita</button>
          <button onClick={() => setActiveTab('gallery')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${activeTab === 'gallery' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100'}`}><Image size={20} /> Galeri</button>
          <button onClick={() => setActiveTab('teachers')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${activeTab === 'teachers' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100'}`}><Users size={20} /> Guru & Staff</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                {isEditingTeacher ? <Pencil size={20} /> : <Plus size={20} />} 
                {isEditingTeacher ? 'Edit Data Guru' : `Tambah ${activeTab === 'news' ? 'Berita' : activeTab === 'gallery' ? 'Media' : 'Guru'}`}
              </h3>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Metode Upload</label>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button type="button" onClick={() => setImageInputMethod('file')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-md transition ${imageInputMethod === 'file' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}><Upload size={14} /> Upload File</button>
                  <button type="button" onClick={() => setImageInputMethod('url')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-md transition ${imageInputMethod === 'url' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}><LinkIcon size={14} /> Link URL (YouTube)</button>
                </div>
              </div>

              {activeTab === 'news' && (
                <form onSubmit={handleNewsSubmit} className="space-y-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Judul Berita</label><input required type="text" value={newsForm.title} onChange={e => setNewsForm({...newsForm, title: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Tanggal</label><input required type="date" value={newsForm.date} onChange={e => setNewsForm({...newsForm, date: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                  <ImageInput method={imageInputMethod} value={imageInputMethod === 'url' ? newsForm.image : ''} file={selectedFile} preview={previewUrl} label="Gambar Utama" onFileChange={handleFileChange} onUrlChange={(val: string) => {setNewsForm({...newsForm, image: val}); setPreviewUrl(val);}} onClear={clearImageSelection} />
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Isi Berita</label><textarea required rows={4} value={newsForm.excerpt} onChange={e => setNewsForm({...newsForm, excerpt: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                  <SubmitButton isSubmitting={isSubmitting} label="Posting Berita" />
                </form>
              )}

              {activeTab === 'gallery' && (
                <form onSubmit={handleGallerySubmit} className="space-y-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Keterangan</label><input required type="text" value={galleryForm.alt} onChange={e => setGalleryForm({...galleryForm, alt: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Deskripsi foto..." /></div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                    <select value={galleryForm.category} onChange={e => setGalleryForm({...galleryForm, category: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none">
                      <option value="Kegiatan">Kegiatan</option>
                      <option value="Prestasi">Prestasi</option>
                      <option value="Fasilitas">Fasilitas</option>
                    </select>
                  </div>
                  <ImageInput method={imageInputMethod} value={imageInputMethod === 'url' ? galleryForm.image : ''} file={selectedFile} preview={previewUrl} label="File / Link Video" accept="image/*" onFileChange={handleFileChange} onUrlChange={(val: string) => {setGalleryForm({...galleryForm, image: val}); setPreviewUrl(val);}} onClear={clearImageSelection} />
                  <SubmitButton isSubmitting={isSubmitting} label="Upload Media" color="blue" />
                </form>
              )}

              {activeTab === 'teachers' && (
                  <form onSubmit={handleTeacherSubmit} className="space-y-4">
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">Nama</label><input required type="text" value={teacherForm.name} onChange={e => setTeacherForm({...teacherForm, name: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">Jabatan</label><input required type="text" value={teacherForm.role} onChange={e => setTeacherForm({...teacherForm, role: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">NIP</label><input type="text" value={teacherForm.nip} onChange={e => setTeacherForm({...teacherForm, nip: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">No. HP</label><input type="text" value={teacherForm.phone} onChange={e => setTeacherForm({...teacherForm, phone: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                    </div>
                    <ImageInput method={imageInputMethod} value={imageInputMethod === 'url' ? teacherForm.image : ''} file={selectedFile} preview={previewUrl} label="Foto Guru" onFileChange={handleFileChange} onUrlChange={(val: string) => {setTeacherForm({...teacherForm, image: val}); setPreviewUrl(val);}} onClear={clearImageSelection} />
                    <div className="flex gap-2">
                         {isEditingTeacher && <button type="button" onClick={cancelEditTeacher} className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 rounded-lg transition">Batal</button>}
                         <SubmitButton isSubmitting={isSubmitting} label={isEditingTeacher ? "Simpan" : "Tambah"} color="blue" />
                    </div>
                  </form>
              )}
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2 space-y-6">
             <ListHeader title={activeTab === 'news' ? 'Berita' : activeTab === 'gallery' ? 'Media Galeri' : 'Guru & Staff'} count={activeTab === 'news' ? news.length : activeTab === 'gallery' ? gallery.length : teachers.length} loading={loading} onRefresh={refreshData} />
            
            {activeTab === 'news' && (
              <div className="space-y-4">
                {news.map(item => {
                    const videoId = getYouTubeId(item.image);
                    return (
                        <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4 items-start group hover:border-blue-200 transition">
                            <div className="w-24 h-24 shrink-0 rounded-lg bg-slate-100 relative overflow-hidden flex items-center justify-center">
                                {videoId ? (
                                    <div className="w-full h-full relative">
                                        <img src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} alt="YT" className="w-full h-full object-cover"/>
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20"><PlayCircle size={20} className="text-white"/></div>
                                    </div>
                                ) : (
                                    <img src={item.image} alt={item.title} onError={(e) => e.currentTarget.style.display = 'none'} className="w-full h-full object-cover" />
                                )}
                            </div>
                            <div className="flex-grow">
                            <h4 className="font-bold text-slate-800 text-lg">{item.title}</h4>
                            <p className="text-xs text-slate-500 mb-2 flex items-center gap-1"><Monitor size={12} /> {item.date}</p>
                            <p className="text-sm text-slate-600 line-clamp-2">{item.excerpt}</p>
                            </div>
                            <button onClick={() => requestDelete(item.id, 'news', item.title)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"><Trash2 size={20} /></button>
                        </div>
                    );
                })}
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.map(item => {
                    const videoId = getYouTubeId(item.image);
                    return (
                        <div key={item.id} className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 relative group overflow-hidden">
                            <div className="w-full h-40 rounded-lg bg-slate-900 relative overflow-hidden flex items-center justify-center">
                                {videoId ? (
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <img src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} alt="Video Thumbnail" className="w-full h-full object-cover opacity-80" />
                                        <div className="absolute z-10 bg-red-600 rounded-full p-2"><PlayCircle size={24} className="text-white" /></div>
                                    </div>
                                ) : (
                                    <img src={item.image} alt={item.alt} onError={(e) => { e.currentTarget.style.display = 'none'; }} className="w-full h-full object-cover" />
                                )}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition rounded-lg flex flex-col justify-end p-3 pointer-events-none">
                                <span className="text-white text-xs font-bold bg-blue-600 px-2 py-0.5 rounded w-fit mb-1">{item.category}</span>
                                <p className="text-white text-xs truncate">{item.alt}</p>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); requestDelete(item.id, 'gallery', item.alt); }} className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition shadow-md hover:scale-110 z-20"><Trash2 size={14} /></button>
                        </div>
                    );
                })}
              </div>
            )}

            {activeTab === 'teachers' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {teachers.map(t => (
                        <div key={t.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 group hover:border-blue-200 transition">
                            <div className="w-16 h-16 shrink-0 rounded-full bg-slate-100 border border-slate-200 relative overflow-hidden flex items-center justify-center">
                                <Users className="text-slate-300 absolute" size={20} />
                                <img src={t.image} alt={t.name} onError={(e) => e.currentTarget.style.display = 'none'} className="w-full h-full object-cover relative z-10" />
                            </div>
                            <div className="flex-grow">
                                <h4 className="font-bold text-slate-800">{t.name}</h4>
                                <p className="text-xs text-blue-600 font-semibold">{t.role}</p>
                            </div>
                            <div className="flex gap-1">
                                <button onClick={() => handleEditTeacher(t)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition"><Pencil size={18} /></button>
                                <button onClick={() => requestDelete(t.id, 'teachers', t.name)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </div>
        </div>
      </div>

      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
                {!isDeleting ? (
                    <div className="p-6 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600"><Trash2 size={32} /></div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Hapus Data Ini?</h3>
                        <p className="text-slate-600 mb-6">Yakin menghapus <span className="font-semibold text-slate-800">"{deleteModal.title}"</span>?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })} className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition">Batal</button>
                            <button onClick={executeDelete} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition shadow-md hover:shadow-lg">Ya, Hapus</button>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 text-center bg-slate-50">
                        <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center"><Loader2 className="w-full h-full text-blue-500 animate-spin absolute inset-0" strokeWidth={1} /><span className="text-2xl font-bold text-blue-600 relative z-10">{countdown}</span></div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Mohon Tunggu...</h3>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

// Reusable Components
const ImageInput = ({ method, value, file, preview, label = "Gambar", onFileChange, onUrlChange, onClear, accept = "image/*" }: any) => {
    // Helper Regex
    const getYTId = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };
    
    const ytId = getYTId(preview);

    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
            {method === 'url' ? (
                <input type="url" value={value || ''} placeholder="https://youtube.com/..." onChange={e => onUrlChange(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
            ) : (
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-blue-500 hover:bg-blue-50 transition text-center cursor-pointer relative group">
                    <input type="file" accept={accept} onChange={onFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className="flex flex-col items-center justify-center text-slate-500 group-hover:text-blue-600 transition"><Upload size={32} className="mb-2" /><span className="text-xs font-medium">Klik untuk pilih file</span></div>
                </div>
            )}
            
            {preview && (
                <div className="mt-3 relative w-full h-40 rounded-lg overflow-hidden border border-slate-200 shadow-sm group">
                    {ytId ? (
                         <div className="relative w-full h-full flex items-center justify-center bg-black">
                            <img src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`} alt="YT Preview" className="w-full h-full object-cover opacity-80" />
                            <div className="absolute z-10 bg-red-600 rounded-full p-2 text-white shadow-lg"><PlayCircle size={20} /></div>
                         </div>
                    ) : (
                        <img src={preview} alt="Preview" onError={(e) => e.currentTarget.style.display='none'} className="w-full h-full object-cover relative z-10" />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center z-20 pointer-events-none">
                        <div className="pointer-events-auto"><button type="button" onClick={onClear} className="bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold hover:bg-red-700 flex items-center gap-1"><Trash2 size={12} /> Hapus</button></div>
                    </div>
                </div>
            )}
        </div>
    );
}

const SubmitButton = ({ isSubmitting, label, color = 'blue' }: any) => (
    <button type="submit" disabled={isSubmitting} className={`w-full bg-${color}-600 hover:bg-${color}-700 disabled:bg-slate-400 text-white font-bold py-3 rounded-lg transition shadow-md hover:shadow-lg mt-2 flex items-center justify-center gap-2`}>
        {isSubmitting ? <><Loader2 size={20} className="animate-spin" /> Menyimpan...</> : label}
    </button>
);

const ListHeader = ({ title, count, loading, onRefresh }: any) => (
    <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">Daftar {title} Aktif {loading && <Loader2 size={16} className="animate-spin text-blue-600"/>}</h3>
        <div className="flex items-center gap-2"><span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">{count} Item</span><button onClick={onRefresh} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"><RefreshCw size={16} className={loading ? 'animate-spin' : ''} /></button></div>
    </div>
);