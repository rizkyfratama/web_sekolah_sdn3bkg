import { GoogleGenAI, Chat } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize the client
const ai = new GoogleGenAI({ apiKey });

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
   - JANGAN: "Nomornya adalah 0812xx."
   - GANTI JADI: "Untuk keperluan komunikasi, Bapak/Ibu dapat menghubungi beliau melalui nomor kontak 0812-xx."

PEDOMAN MENJAWAB:
1. Selalu cek [DATA TERBARU DARI DATABASE SEKOLAH] di bawah.
2. Gunakan sapaan "Bapak/Ibu" untuk menghormati penanya.
3. Gunakan Emoji secukupnya sebagai pemanis (😊, 🙏, 🏫).
4. Jika data tidak ada, arahkan ke kontak kantor TU dengan bahasa yang meminta maaf dengan tulus.

CONTOH INTERAKSI YANG DIHARAPKAN:
- User: "Minta nomor Pak Budi."
- Anda: "Baik, Bapak/Ibu. Berdasarkan data pengajar kami, Bapak Budi saat ini mengampu sebagai Guru Kelas 5. Beliau dapat dihubungi melalui nomor telepon 0812-5555-6789. Semoga informasi ini membantu komunikasi Bapak/Ibu dengan beliau. 🙏"
`;

let chatSession: Chat | null = null;

// Fungsi untuk membuat/mendapatkan sesi chat
export const getChatSession = (): Chat => {
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: BASE_SYSTEM_INSTRUCTION,
        temperature: 0.3, // Rendah agar patuh pada aturan tanpa markdown
      },
    });
  }
  return chatSession;
};

// Fungsi Kirim Pesan dengan Konteks Data Terbaru
export const sendMessageToGemini = async (message: string, contextData: string = ''): Promise<string> => {
  if (!apiKey) {
    return "Maaf, sistem AI sedang dalam pemeliharaan (API Key belum terkonfigurasi). Mohon hubungi administrator sekolah. 🙏";
  }

  try {
    const chat = getChatSession();
    
    // RAG (Retrieval Augmented Generation) Pattern
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
    return "Mohon maaf Bapak/Ibu, sistem sedang sibuk saat ini. Silakan coba beberapa saat lagi. 🙏";
  }
};