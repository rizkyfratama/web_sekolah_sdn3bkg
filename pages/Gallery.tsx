import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Aperture, PlayCircle, ImageOff } from 'lucide-react';

const CATEGORIES = ['Semua', 'Kegiatan', 'Prestasi', 'Fasilitas'];

export const Gallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const { gallery } = useData();

  const filteredItems = activeCategory === 'Semua' 
    ? gallery 
    : gallery.filter(item => item.category === activeCategory);

  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="py-20 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 flex items-center justify-center text-blue-600 mx-auto mb-6 transform rotate-3">
            <Aperture size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Galeri Sekolah</h1>
          <p className="text-slate-600 text-lg max-w-xl mx-auto font-medium">Dokumentasi visual foto & video kegiatan, fasilitas, dan momen berharga keluarga besar SD Negeri 3 Bangkuang.</p>
        </div>

        {/* Filter Buttons - Glassmorphism */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 backdrop-blur-sm ${
                activeCategory === cat 
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-500/30 scale-105' 
                  : 'bg-white/40 text-slate-700 hover:bg-white/70 border border-white/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Modern Grid */}
        {filteredItems.length === 0 ? (
           <div className="text-center py-20 bg-white/40 backdrop-blur-md rounded-3xl border border-dashed border-white/50">
              <p className="text-slate-500 italic font-medium">Belum ada foto/video untuk kategori ini.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => {
                const videoId = getYouTubeId(item.image);
                const isYt = !!videoId;

                return (
                    <div 
                        key={item.id} 
                        className="group relative overflow-hidden rounded-[2rem] shadow-sm bg-white/20 backdrop-blur-sm aspect-square cursor-pointer border border-white/40"
                    >
                        
                        {/* RENDER LOGIC: VIDEO VS IMAGE */}
                        {isYt ? (
                            <div className="w-full h-full relative group-hover:scale-105 transition duration-700">
                                <img 
                                    src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                                    alt={item.alt}
                                    className="w-full h-full object-cover absolute inset-0"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white rounded-full p-3 shadow-xl z-20 opacity-90 group-hover:scale-110 transition">
                                    <PlayCircle size={32} fill="white" />
                                </div>
                            </div>
                        ) : item.image ? (
                            <div className="w-full h-full relative">
                                <img 
                                    src={item.image} 
                                    alt={item.alt} 
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                    className="w-full h-full object-cover transition duration-700 group-hover:scale-110 relative z-10"
                                />
                            </div>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-white/30">
                                <ImageOff size={48} className="mb-2 opacity-50"/>
                            </div>
                        )}
                        
                        {/* Overlay Modern */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-6 text-center z-30 pointer-events-none">
                           <div className="transform translate-y-4 group-hover:translate-y-0 transition duration-300">
                                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 backdrop-blur-md border border-white/30 inline-block">
                                    {isYt ? 'YOUTUBE' : item.category}
                                </span>
                                <p className="text-white font-medium line-clamp-2 mt-2">
                                    {item.alt}
                                </p>
                           </div>
                        </div>

                        {/* YouTube Link Handling */}
                        {isYt && (
                            <a 
                                href={item.image} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="absolute inset-0 z-40"
                                aria-label="Putar Video di YouTube"
                            ></a>
                        )}
                    </div>
                )
            })}
          </div>
        )}
      </div>
    </div>
  );
};