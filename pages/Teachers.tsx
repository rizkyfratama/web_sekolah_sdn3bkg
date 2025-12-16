import React from 'react';
import { useData } from '../context/DataContext';
import { Loader2, User, Phone, MessageCircle, Sparkles, Award } from 'lucide-react';

export const Teachers: React.FC = () => {
  const { teachers, loading } = useData();

  return (
    <div className="py-20 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-24 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md border border-white/60 shadow-sm px-4 py-2 rounded-full mb-6">
            <Sparkles size={16} className="text-yellow-500 fill-yellow-500" />
            <span className="text-blue-700 font-bold tracking-widest uppercase text-xs">SDM Berkualitas</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            Guru & Tenaga Pendidik
          </h1>
          <p className="text-slate-700 text-lg md:text-xl leading-relaxed font-medium">
            Mengenal lebih dekat sosok-sosok inspiratif yang berdedikasi membimbing dan membentuk karakter putra-putri Anda di SD Negeri 3 Bangkuang.
          </p>
        </div>

        {loading ? (
           <div className="flex flex-col items-center justify-center py-20 gap-4">
               <Loader2 className="animate-spin text-blue-600" size={48} />
               <p className="text-slate-600 animate-pulse font-medium">Memuat data guru...</p>
           </div>
        ) : teachers.length === 0 ? (
           <div className="text-center py-16 bg-white/60 backdrop-blur-md rounded-[2rem] border border-dashed border-white/60 max-w-2xl mx-auto">
               <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 border border-white/50">
                   <User size={32} />
               </div>
               <p className="text-slate-600 font-medium">Data guru belum tersedia saat ini.</p>
           </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {teachers.map((teacher, index) => (
                <div 
                    key={teacher.id} 
                    className="group relative bg-white/60 backdrop-blur-lg p-3 rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 hover:bg-white/80 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full border border-white/60"
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    {/* Image Container */}
                    <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-white/30 mb-4 border border-white/40">
                        {teacher.image ? (
                            <img 
                                src={teacher.image} 
                                alt={teacher.name || "Foto Guru"} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                loading="lazy"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-white/20 gap-2">
                                <User size={64} strokeWidth={1.5} />
                                <span className="text-xs font-medium opacity-50">No Photo</span>
                            </div>
                        )}
                        
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500"></div>

                        {/* Floating Badges */}
                        {teacher.role?.toLowerCase().includes('kepala') && (
                            <div className="absolute top-3 left-3">
                                <span className="bg-yellow-400/90 backdrop-blur-sm text-yellow-950 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                                    <Award size={12} /> KEPALA SEKOLAH
                                </span>
                            </div>
                        )}

                        {/* Social Action */}
                        {teacher.phone && (
                            <div className="absolute bottom-3 right-3 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                                <a 
                                    href={`https://wa.me/${String(teacher.phone).replace(/^0/, '62').replace(/\D/g, '')}`} 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center transition-colors hover:scale-110"
                                    title="Hubungi via WhatsApp"
                                >
                                    <MessageCircle size={20} fill="white" />
                                </a>
                            </div>
                        )}
                    </div>
                    
                    {/* Content */}
                    <div className="px-2 pb-2 text-center flex-grow flex flex-col items-center">
                        <span className="inline-block px-3 py-1 bg-white/60 border border-white/50 text-blue-800 text-xs font-bold rounded-full mb-3 tracking-wide group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                            {teacher.role || 'Tenaga Pendidik'}
                        </span>
                        
                        <h3 className="text-lg font-bold text-slate-900 mb-1 leading-tight group-hover:text-blue-700 transition-colors">
                            {teacher.name || <span className="text-slate-500 italic">Nama belum diisi</span>}
                        </h3>
                        
                        {teacher.nip && (
                            <p className="text-xs text-slate-600 font-mono mt-1 bg-white/50 border border-white/40 px-2 py-1 rounded-md">
                                NIP. {teacher.nip}
                            </p>
                        )}
                    </div>
                </div>
            ))}
            </div>
        )}
      </div>
      
      <style>{`
        .group {
            animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
        }
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(40px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
      `}</style>
    </div>
  );
};