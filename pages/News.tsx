import React, { useState, useEffect } from 'react';
import { Calendar, User, Search, X, Share2, Clock, ChevronRight, PlayCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { NewsItem } from '../types';

export const News: React.FC = () => {
  const { news } = useData();
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Helper Regex YouTube
  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (selectedNews) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedNews]);

  const filteredNews = news.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-20 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Berita & Pengumuman</h1>
          <p className="text-slate-700 text-lg max-w-2xl mx-auto font-medium">Informasi terupdate seputar kegiatan akademik, prestasi, dan pengumuman resmi sekolah.</p>
        </div>

        {/* Search Bar - Glassmorphism */}
        <div className="max-w-xl mx-auto mb-16 relative">
          <input 
            type="text" 
            placeholder="Cari berita..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-4 pl-12 pr-4 rounded-full bg-white/60 backdrop-blur-md border border-white/60 shadow-sm focus:ring-2 focus:ring-blue-500 focus:bg-white/90 outline-none transition placeholder:text-slate-500 text-slate-900 font-medium"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main News Feed */}
            <div className="lg:col-span-2 space-y-6">
                {filteredNews.length === 0 ? (
                  <div className="text-center py-20 bg-white/60 backdrop-blur-md rounded-2xl border border-dashed border-white/60">
                    <p className="text-slate-600 font-medium">
                        {searchTerm ? "Berita tidak ditemukan." : "Belum ada berita yang diposting."}
                    </p>
                  </div>
                ) : (
                  filteredNews.map(item => {
                      const ytId = getYouTubeId(item.image);
                      
                      return (
                          <article key={item.id} className="group bg-white/60 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-xl hover:bg-white/80 transition duration-300 border border-white/60 flex flex-col md:flex-row gap-6">
                              <div className="w-full md:w-1/3 aspect-video md:aspect-[4/3] overflow-hidden rounded-xl shrink-0 relative bg-white/30">
                                  {ytId ? (
                                      <>
                                        <img src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition">
                                            <PlayCircle className="text-white drop-shadow-lg" size={40} />
                                        </div>
                                      </>
                                  ) : (
                                      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" onError={(e) => e.currentTarget.style.display = 'none'} />
                                  )}
                                  
                                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-slate-800 md:hidden">
                                      {item.date}
                                  </div>
                              </div>
                              <div className="flex flex-col justify-center flex-grow">
                                  <div className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-600 mb-3 uppercase tracking-wide">
                                      <span className="flex items-center gap-1 bg-white/60 px-2 py-1 rounded-md text-slate-800 border border-white/50"><Calendar size={12} /> {item.date}</span>
                                      <span className="flex items-center gap-1"><User size={12} /> Admin</span>
                                  </div>
                                  <h2 
                                    onClick={() => setSelectedNews(item)}
                                    className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition cursor-pointer leading-tight"
                                  >
                                      {item.title}
                                  </h2>
                                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4 line-clamp-3 font-medium">
                                      {item.excerpt}
                                  </p>
                                  <button 
                                    onClick={() => setSelectedNews(item)}
                                    className="text-blue-700 text-sm font-bold hover:text-blue-900 self-start mt-auto flex items-center gap-1 group-hover:gap-2 transition-all"
                                  >
                                      Baca Selengkapnya <ChevronRight size={16} />
                                  </button>
                              </div>
                          </article>
                      );
                  })
                )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
                <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl border border-white/60 shadow-sm sticky top-24">
                    <h3 className="font-bold text-slate-900 mb-6 text-xl border-l-4 border-blue-500 pl-3">Kategori Popular</h3>
                    <ul className="space-y-3">
                        {['Pengumuman', 'Prestasi', 'Kegiatan', 'Artikel', 'Kurikulum'].map(cat => (
                            <li key={cat}>
                                <button className="w-full flex justify-between items-center text-slate-700 hover:text-blue-700 p-2 hover:bg-white/50 rounded-lg transition group text-left font-medium">
                                    <span>{cat}</span>
                                    <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-500" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
      </div>

      {/* MODERN NEWS MODAL */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" 
            onClick={() => setSelectedNews(null)}
          ></div>

          {/* Modal Content - Glassy White */}
          <div className="bg-white/95 backdrop-blur-2xl w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl relative z-10 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-white/50">
            
            {/* Header Image Area */}
            <div className="relative h-48 sm:h-72 shrink-0 bg-slate-900 flex items-center justify-center">
                {(() => {
                   const ytId = getYouTubeId(selectedNews.image);
                   if (ytId) {
                       return (
                           <div className="w-full h-full relative group">
                                <img 
                                    src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`} 
                                    onError={(e) => e.currentTarget.src = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                                    alt="Video Thumbnail" 
                                    className="w-full h-full object-cover opacity-80"
                                />
                                <a 
                                    href={selectedNews.image}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition cursor-pointer"
                                >
                                    <PlayCircle size={64} className="text-white drop-shadow-xl hover:scale-110 transition duration-300" />
                                </a>
                           </div>
                       );
                   }
                   return (
                        <>
                            <img 
                                src={selectedNews.image} 
                                alt={selectedNews.title} 
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        </>
                   );
                })()}
                
                <button 
                    onClick={() => setSelectedNews(null)}
                    className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-md transition hover:rotate-90 z-20"
                >
                    <X size={24} />
                </button>

                <div className="absolute bottom-0 left-0 p-6 sm:p-8 text-white w-full pointer-events-none">
                    <div className="flex items-center gap-4 text-xs sm:text-sm font-medium opacity-90 mb-2">
                        <span className="bg-blue-600 px-3 py-1 rounded-full">{selectedNews.date}</span>
                        <span className="flex items-center gap-1"><User size={14}/> Admin Sekolah</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight shadow-black drop-shadow-lg">
                        {selectedNews.title}
                    </h2>
                </div>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar bg-white/80">
                <div className="prose prose-lg prose-slate max-w-none text-slate-800 font-medium">
                    {/* Render paragraphs */}
                    {selectedNews.excerpt.split('\n').map((paragraph, idx) => (
                         <p key={idx} className="mb-4 leading-relaxed">
                            {paragraph}
                         </p>
                    ))}
                    
                    {/* Dummy content extension */}
                    {selectedNews.excerpt.length < 200 && (
                        <>
                            <p className="leading-relaxed">
                                Demikian informasi yang dapat kami sampaikan. Untuk informasi lebih lanjut, silakan menghubungi pihak sekolah atau wali kelas masing-masing. Terima kasih atas perhatian dan kerjasamanya.
                            </p>
                        </>
                    )}
                </div>

                <div className="mt-8 pt-8 border-t border-slate-200 flex justify-between items-center">
                    <div className="text-sm text-slate-600 italic">
                        Diposting oleh Admin Web Sekolah
                    </div>
                    <button className="flex items-center gap-2 text-slate-700 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition font-medium text-sm">
                        <Share2 size={18} /> Bagikan
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};