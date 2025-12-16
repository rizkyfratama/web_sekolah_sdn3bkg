import React from 'react';
import { ArrowRight, BookOpen, Trophy, Users, Star, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

export const Home: React.FC = () => {
  const { news } = useData();
  const latestNews = news.slice(0, 3); // Get top 3 news

  // Helper Regex YouTube
  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="flex flex-col gap-20 pb-20">
      
      {/* Custom CSS for Float Animation */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 6s ease-in-out infinite;
          animation-delay: 3s;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative min-h-[700px] flex items-center justify-center pt-20">
        <div className="container mx-auto px-4 z-10 text-center relative">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md border border-white/60 text-blue-700 font-bold rounded-full text-xs uppercase tracking-widest mb-8 shadow-sm animate-in fade-in slide-in-from-top-4 duration-1000">
            <Star size={12} className="fill-blue-600 text-blue-600" /> Penerimaan Peserta Didik Baru
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight tracking-tight text-slate-900 drop-shadow-sm">
            Membangun <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700">
              Generasi Emas
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-700 mb-10 max-w-2xl mx-auto leading-relaxed font-semibold">
            SD Negeri 3 Bangkuang: Bersinergi menciptakan lingkungan belajar yang agamis, cerdas, dan berkarakter Pancasila di era digital.
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/profile" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30">
              Profil Sekolah <ArrowRight size={18} />
            </Link>
            <Link to="/gallery" className="bg-white/60 backdrop-blur-md border border-white/60 hover:bg-white/80 text-slate-800 px-8 py-4 rounded-full font-bold transition-all hover:scale-105 shadow-sm">
              Jelajahi Galeri
            </Link>
          </div>
        </div>
      </section>

      {/* Features Cards - High Contrast */}
      <section className="container mx-auto px-4 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Users, title: "Tenaga Pendidik", color: "blue", text: "Guru bersertifikasi dan berpengalaman dalam membimbing siswa." },
            { icon: BookOpen, title: "Kurikulum Merdeka", color: "purple", text: "Pembelajaran modern yang berpusat pada minat dan bakat siswa." },
            { icon: Trophy, title: "Prestasi Sekolah", color: "amber", text: "Berbagai juara diraih tingkat kecamatan, kabupaten, hingga provinsi." },
          ].map((feature, idx) => (
            <div key={idx} className="bg-white/60 backdrop-blur-lg p-8 rounded-3xl shadow-sm border border-white/60 hover:shadow-xl hover:bg-white/80 hover:-translate-y-2 transition duration-500 group">
              <div className={`bg-${feature.color}-50/90 w-16 h-16 rounded-2xl flex items-center justify-center text-${feature.color}-700 mb-6 group-hover:scale-110 group-hover:rotate-3 transition duration-500 shadow-sm border border-white/50`}>
                <feature.icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-700 leading-relaxed font-medium">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sambutan Kepala Sekolah - High Contrast */}
      <section className="container mx-auto px-4">
        <div className="bg-white/60 backdrop-blur-lg rounded-[2.5rem] overflow-visible shadow-lg border border-white/60 relative p-6 md:p-12">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            
            {/* Foto Section */}
            <div className="md:col-span-5 relative flex justify-center md:justify-start">
               {/* Background Blobs Animation */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-400/20 blur-3xl rounded-full animate-pulse z-0"></div>
               
               {/* Floating Card Container */}
               <div className="relative z-10 w-72 h-[26rem] md:w-80 md:h-[30rem] animate-float group">
                  {/* Decorative Back Frames */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/60 to-indigo-100/60 rounded-[2rem] transform rotate-6 shadow-lg border border-white/60 transition duration-500 group-hover:rotate-12"></div>
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-md rounded-[2rem] transform -rotate-3 shadow-xl border border-white/70 transition duration-500 group-hover:-rotate-6"></div>
                  
                  {/* Main Image Container */}
                  <div className="absolute inset-2 bg-white/30 rounded-[1.8rem] overflow-hidden shadow-inner border border-white/50">
                      <img 
                        src="https://drive.google.com/thumbnail?id=1ldReFc41qEW0Xt5A99YpCrb5kUcMDOkH&sz=w1000" 
                        alt="Ibu Ria Frenica, S.Pd" 
                        className="w-full h-full object-cover object-top hover:scale-110 transition duration-700"
                        onError={(e) => {
                          e.currentTarget.src = "https://ui-avatars.com/api/?name=Ria+Frenica&background=0D8ABC&color=fff&size=512";
                        }}
                      />
                  </div>

                  {/* Floating Name Badge */}
                  <div className="absolute -bottom-6 -right-4 bg-white/90 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-xl border border-white/60 animate-float-delayed flex flex-col items-center min-w-[200px]">
                      <h3 className="font-bold text-slate-800 text-lg">Ibu Ria Frenica, S.Pd</h3>
                      <span className="text-xs font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-full uppercase tracking-wider mt-1">Kepala Sekolah</span>
                  </div>
               </div>
            </div>
            
            {/* Text Section */}
            <div className="md:col-span-7 flex flex-col justify-center relative z-10 pt-10 md:pt-0 text-center md:text-left">
              <div className="mb-6">
                <span className="inline-block py-1 px-3 rounded-full bg-white/70 border border-white/60 text-blue-800 text-xs font-bold tracking-widest uppercase mb-4 shadow-sm">Sambutan Kepala Sekolah</span>
                <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
                  Selamat Datang di <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700">SD Negeri 3 Bangkuang</span>
                </h2>
              </div>
              <div className="space-y-6 text-slate-800 text-lg leading-relaxed relative font-medium">
                <p>
                  <span className="text-6xl text-blue-300/60 font-serif absolute -top-8 -left-4 -z-10">"</span>
                  Kami berkomitmen untuk menciptakan lingkungan belajar yang inspiratif, inklusif, dan inovatif. Website ini adalah jendela informasi bagi seluruh warga sekolah dan masyarakat luas.
                </p>
                <p>
                  Mari bersinergi memajukan pendidikan untuk masa depan anak bangsa yang lebih cerah, berlandaskan iman dan takwa.
                </p>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-6 mt-10">
                 <div className="text-left bg-white/60 px-6 py-3 rounded-xl border border-white/60 shadow-sm backdrop-blur-sm">
                    <p className="font-bold text-slate-900 text-lg">NIP. 19851124 201101 2 004</p>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Latest News Preview */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Kabar Sekolah</h2>
            <p className="text-slate-700 mt-2 text-lg font-medium">Mengikuti jejak langkah dan prestasi siswa kami.</p>
          </div>
          <Link to="/news" className="hidden md:inline-flex items-center justify-center px-6 py-3 bg-white/60 backdrop-blur-sm border border-white/60 rounded-full text-slate-800 font-bold hover:bg-blue-600 hover:text-white hover:border-blue-600 transition duration-300 group shadow-sm">
            Lihat Semua <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition"/>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestNews.map((item) => {
                const ytId = getYouTubeId(item.image);

                return (
                <Link to="/news" key={item.id} className="group cursor-pointer flex flex-col h-full bg-white/60 backdrop-blur-lg rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:bg-white/80 transition duration-500 border border-white/60">
                    <div className="overflow-hidden aspect-[4/3] relative bg-white/30">
                        {ytId ? (
                            <>
                                <img 
                                    src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition z-10">
                                    <PlayCircle className="text-white drop-shadow-lg" size={40} />
                                </div>
                            </>
                        ) : (
                            <img 
                                src={item.image} 
                                alt={item.title} 
                                className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                        )}
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md border border-white/40 px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm z-20">
                          {item.date}
                        </div>
                    </div>
                    <div className="p-8 flex flex-col flex-grow relative">
                        <div className="absolute -top-6 right-6 bg-blue-600 text-white p-3 rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 transition duration-500 translate-y-4 group-hover:translate-y-0 z-30">
                            <ArrowRight size={20} />
                        </div>
                        <h3 className="font-bold text-xl text-slate-900 group-hover:text-blue-700 transition mb-3 line-clamp-2 leading-tight">
                            {item.title}
                        </h3>
                        <p className="text-slate-700 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed font-medium">
                            {item.excerpt}
                        </p>
                        <span className="text-slate-600 text-xs font-bold tracking-widest uppercase group-hover:text-blue-700 transition">Baca Berita</span>
                    </div>
                </Link>
                );
            })}
        </div>
         <div className="mt-10 text-center md:hidden">
            <Link to="/news" className="inline-flex w-full items-center justify-center gap-2 bg-white/60 border border-slate-300 text-slate-800 font-bold px-6 py-4 rounded-full hover:bg-white transition shadow-sm">
              Lihat Semua Berita <ArrowRight size={16} />
            </Link>
         </div>
      </section>
    </div>
  );
};