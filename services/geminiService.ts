import { GoogleGenAI, Chat } from "@google/genai";

// Fungsi EKSTRA AMAN untuk mengambil API Key dari berbagai kemungkinan environment
const getApiKey = (): string => {
  let key = '';

  // 1. Coba ambil dari process.env (Standar Node/CRA/Next.js)
  try {
    if (process.env.API_KEY) key = process.env.API_KEY;
    if (!key && process.env.VITE_API_KEY) key = process.env.VITE_API_KEY;
    if (!key && process.env.REACT_APP_API_KEY) key = process.env.REACT_APP_API_KEY;
  } catch (e) {
    // Ignore ReferenceError if process is not defined
  }

  // 2. Coba ambil dari import.meta.env (Standar Vite Modern)
  if (!key) {
    try {
      // @ts-ignore
      if (import.meta.env?.VITE_API_KEY) key = import.meta.env.VITE_API_KEY;
      // @ts-ignore
      if (!key && import.meta.env?.API_KEY) key = import.meta.env.API_KEY;
    } catch (e) {
      // Ignore
    }
  }

  return key;
};

const apiKey = getApiKey();
let ai: GoogleGenAI | null = null;

// Inisialisasi Google AI Client
if (apiKey) {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (error) {
    console.error("Gagal menginisialisasi Google AI:", error);
  }
} else {
    console.warn("⚠️ Gemini Service: API Key kosong. Pastikan Environment Variable diset sebagai 'VITE_API_KEY' atau 'API_KEY' di Vercel.");
}

const BASE_SYSTEM_INSTRUCTION = `
PERAN DAN PERSONA:
Anda adalah Asisten Virtual Resmi dari SD Negeri 3 Bangkuang.
Posisikan diri Anda sebagai Humas Sekolah yang Sangat Ramah, Humanis, Sopan, dan Membantu.
Gaya bicara Anda harus seperti manusia yang sedang melayani tamu terhormat, bukan seperti robot.

INFORMASI DASAR SEKOLAH (Fakta Tetap):
- Nama Sekolah: SD Negeri 3 Bangkuang
- Alamat: Bangkuang RT 22 RW 08, Kabupaten Barito Selatan, Kalimantan Tengah
- Kepala Sekolah: Ibu Ria Frenica, S.Pd. (NIP: 19851124 201101 2 004)
- Visi: "Terwujudnya peserta didik yang beriman, cerdas, terampil, dan berkarakter Profil Pelajar Pancasila."
- Jam Belajar: Senin-Kamis (07.00-12.30), Jumat (07.00-11.00), Sabtu (07.00-12.00).
- Kontak Resmi: (0513) 555-1234 atau sdn3karaukuala25@gmail.com

ATURAN PENULISAN & ESTETIKA (PENTING):
1. **DILARANG MENGGUNAKAN MARKDOWN**: Jangan gunakan tanda bintang dua (**teks**), tanda pagar (#), atau simbol formatting kode lainnya. Tulis teks biasa yang bersih.
2. **JANGAN MENEBALKAN TEKS**: Tulis semua informasi dalam format teks normal yang mengalir.
3. **Format Nomor Telepon**: Jika menyebutkan angka panjang (NIP atau HP), pisahkan dengan tanda hubung agar mudah dibaca (Contoh: 0812-3456-7890).
4. **Gaya Bahasa Cantik**: Gunakan kalimat pembuka dan penutup yang manis.

PEDOMAN MENJAWAB:
1. Selalu cek [DATA TERBARU DARI DATABASE SEKOLAH] di bawah.
2. Gunakan sapaan "Bapak/Ibu".
3. Gunakan Emoji secukupnya (😊, 🙏, 🏫).
4. Jika data tidak ada, arahkan ke kontak kantor TU.

CONTOH INTERAKSI:
- User: "Minta nomor Pak Budi."
- Anda: "Baik, Bapak/Ibu. Berdasarkan data, Bapak Budi (Guru Kelas 5) dapat dihubungi melalui 0812-5555-6789. Semoga membantu. 🙏"
`;

let chatSession: Chat | null = null;

export const getChatSession = (): Chat => {
  if (!ai) {
      throw new Error("AI Client belum siap (API Key hilang).");
  }
  
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: BASE_SYSTEM_INSTRUCTION,
        temperature: 0.3, 
      },
    });
  }
  return chatSession;
};

export const sendMessageToGemini = async (message: string, contextData: string = ''): Promise<string> => {
  // Diagnosa Error yang Lebih Spesifik untuk User
  if (!apiKey || !ai) {
    console.error("API Key Missing. Checked: process.env.API_KEY, process.env.VITE_API_KEY, import.meta.env.VITE_API_KEY");
    return `⚠️ SISTEM ERROR: API Key tidak terdeteksi.
    
SOLUSI UNTUK ADMIN:
Di Vercel (Settings > Environment Variables), harap ganti nama variable "API_KEY" menjadi "VITE_API_KEY".
Vercel seringkali tidak mengirim variable tanpa awalan "VITE_" ke browser demi keamanan.
    
Setelah diganti, lakukan Redeploy. Terima kasih. 🙏`;
  }

  try {
    const chat = getChatSession();
    
    const promptWithContext = `
[DATA TERBARU DARI DATABASE SEKOLAH]
${contextData}
[AKHIR DATA]

Pertanyaan Pengguna: "${message}"

Jawablah pertanyaan di atas dengan bahasa yang indah, sopan, dan TANPA tanda bintang (formatting bold).`;

    const response = await chat.sendMessage({ message: promptWithContext });
    return response.text || "Mohon maaf, saya sedang kesulitan memproses permintaan Anda. Boleh diulangi? 😊";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Mohon maaf Bapak/Ibu, sistem sedang sibuk atau mengalami gangguan koneksi. Silakan coba beberapa saat lagi. 🙏";
  }
};