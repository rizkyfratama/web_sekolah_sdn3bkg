import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { useData } from '../context/DataContext';

export const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Selamat datang di Layanan Informasi SD Negeri 3 Bangkuang. Saya siap membantu Bapak/Ibu terkait informasi sekolah, data guru, atau berita terbaru. 😊',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Ambil Data Terbaru dari Context
  const { teachers, news, gallery } = useData();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Helper: Format Data menjadi String untuk AI
  const generateContextString = () => {
    // FIX: Tambahkan NIP dan Phone agar AI tahu detail lengkap guru
    const teacherList = teachers.map(t => {
        const details = [];
        if (t.role) details.push(t.role);
        if (t.phone) details.push(`Kontak: ${t.phone}`);
        if (t.nip) details.push(`NIP: ${t.nip}`);
        return `- ${t.name} [${details.join(' | ')}]`;
    }).join('\n');

    const newsList = news.slice(0, 5).map(n => `- ${n.title} (Tanggal: ${n.date})`).join('\n'); // Ambil 5 berita terbaru
    const galleryList = gallery.slice(0, 5).map(g => `- ${g.alt} (Kategori: ${g.category})`).join('\n');

    return `
DAFTAR GURU & STAFF TERBARU (LENGKAP):
${teacherList || "Belum ada data guru."}

BERITA TERBARU SEKOLAH:
${newsList || "Belum ada berita."}

GALERI KEGIATAN TERBARU:
${galleryList || "Belum ada dokumentasi."}
    `.trim();
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Generate konteks data terbaru saat tombol kirim ditekan
      const currentContext = generateContextString();
      
      // Kirim pesan + data terbaru ke AI
      const responseText = await sendMessageToGemini(userMessage.text, currentContext);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'model',
          text: "Mohon maaf Bapak/Ibu, koneksi saya sedang terganggu. Boleh diulangi pertanyaannya? 🙏",
          timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-xl transition-transform hover:scale-110 z-40 ${isOpen ? 'hidden' : 'flex'}`}
        aria-label="Open Chat Assistant"
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-full max-w-sm h-[500px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300">
          {/* Header */}
          <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-full">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Asisten SD Negeri 3</h3>
                <p className="text-xs text-blue-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded transition">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-sm">
                  <Loader2 size={16} className="animate-spin text-blue-600" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-100">
            <div className="flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500/50 transition-shadow">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Tanya sesuatu..."
                className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 placeholder:text-slate-400"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="text-blue-600 disabled:text-slate-400 hover:scale-110 transition-transform p-1"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};