import React from 'react';
import { Target, Heart, Award, MapPin, Hash, School, BookOpen, UserCheck } from 'lucide-react';

export const Profile: React.FC = () => {
  return (
    <div className="py-20 min-h-screen">
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <span className="text-blue-700 font-bold tracking-widest uppercase text-sm bg-white/60 border border-white/60 px-4 py-2 rounded-full mb-4 inline-block shadow-sm">Tentang Kami</span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
            Mengenal Lebih Dekat <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700">SD Negeri 3 Bangkuang</span>
          </h1>
          <p className="text-slate-700 text-lg md:text-xl leading-relaxed font-medium">
            Tempat di mana benih-benih masa depan disemaikan dengan penuh kasih sayang, integritas, dan inovasi pendidikan.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
            <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] opacity-20 group-hover:opacity-40 blur-lg transition duration-500"></div>
                <img 
                    src="https://picsum.photos/800/600?random=33" 
                    alt="School Environment" 
                    className="relative rounded-[1.5rem] shadow-2xl w-full h-auto transform group-hover:scale-[1.02] transition duration-500"
                />
            </div>
            <div className="space-y-8">
                <div className="bg-white/60 backdrop-blur-lg p-8 rounded-3xl border border-white/60 shadow-sm hover:shadow-lg transition duration-300">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <School className="text-blue-600" /> Profil Sekolah
                    </h2>
                    <p className="text-slate-700 leading-relaxed mb-4 font-medium">
                        SD Negeri (SDN) 3 Bangkuang adalah Sekolah Dasar (SD) berstatus Negeri yang terletak di Kabupaten Barito Selatan, Kalimantan Tengah. Kami berkomitmen untuk menyelenggarakan pendidikan berkualitas bagi masyarakat sekitar.
                    </p>
                    <p className="text-slate-700 leading-relaxed font-medium">
                        Sekolah ini beralamat di <strong>Bangkuang RT 22 RW 08</strong>, dengan <strong>NPSN 30200873</strong>. Saat ini, SD Negeri 3 Bangkuang telah terakreditasi <strong>C (2021)</strong> dan menerapkan <strong>Kurikulum Merdeka</strong> dalam proses pembelajarannya, di bawah kepemimpinan Ibu Ria Frenica, S.Pd.
                    </p>
                </div>
            </div>
        </div>

        {/* Visi Misi Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {/* Visi Card */}
            <div className="md:col-span-1 bg-gradient-to-br from-blue-700 to-blue-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Target size={120} />
                </div>
                <div className="relative z-10">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-6 border border-white/30">
                        <Target size={28} />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Visi Sekolah</h3>
                    <p className="text-blue-50 italic text-lg leading-relaxed font-medium">
                        "Terwujudnya peserta didik yang beriman, cerdas, terampil, dan berkarakter Profil Pelajar Pancasila."
                    </p>
                </div>
            </div>

            {/* Misi Card */}
            <div className="md:col-span-2 bg-white/60 backdrop-blur-lg border border-white/60 rounded-3xl p-8 shadow-sm hover:shadow-xl transition duration-300">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-orange-100/90 rounded-2xl flex items-center justify-center text-orange-600 border border-orange-200">
                        <Heart size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Misi Kami</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                        "Menanamkan keimanan dan ketakwaan melalui pengamalan ajaran agama.",
                        "Melaksanakan pembelajaran yang aktif, inovatif, kreatif, dan menyenangkan.",
                        "Mengembangkan bakat dan minat siswa melalui kegiatan ekstrakurikuler.",
                        "Membangun kerjasama harmonis antar warga sekolah dan masyarakat."
                    ].map((misi, idx) => (
                        <div key={idx} className="flex gap-4 items-start p-4 rounded-xl hover:bg-white/50 transition duration-200 border border-transparent hover:border-white/40">
                            <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
                                {idx + 1}
                            </span>
                            <p className="text-slate-800 text-sm leading-relaxed font-medium">{misi}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Identity Grid */}
        <div className="mb-16">
            <h3 className="text-center text-2xl font-bold text-slate-900 mb-10">Identitas Satuan Pendidikan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <IdentityCard icon={School} label="Nama Sekolah" value="SD NEGERI 3 BANGKUANG" />
                <IdentityCard icon={Hash} label="NPSN" value="30200873" />
                <IdentityCard icon={Award} label="Status Sekolah" value="Negeri" color="green" />
                <IdentityCard icon={Award} label="Akreditasi" value="C (2021)" color="yellow" />
                <IdentityCard icon={BookOpen} label="Kurikulum" value="Merdeka" color="blue" />
                <IdentityCard icon={UserCheck} label="Kepala Sekolah" value="Ria Frenica, S.Pd" />
                <IdentityCard icon={School} label="Penyelenggara" value="Pemerintah Pusat" />
                <IdentityCard icon={MapPin} label="Alamat" value="Bangkuang RT 22 RW 08" />
                <IdentityCard icon={MapPin} label="Kabupaten" value="Barito Selatan" />
            </div>
        </div>
      </div>
    </div>
  );
};

const IdentityCard = ({ icon: Icon, label, value, color = "blue" }: any) => (
    <div className="bg-white/60 backdrop-blur-lg border border-white/60 p-6 rounded-2xl shadow-sm hover:shadow-md hover:bg-white/80 transition-all hover:-translate-y-1 flex items-center gap-4 group">
        <div className={`w-12 h-12 rounded-xl bg-${color}-50/90 border border-${color}-100 text-${color}-700 flex items-center justify-center group-hover:scale-110 transition duration-300`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-xs text-slate-600 font-bold uppercase tracking-wider mb-1">{label}</p>
            <p className="text-slate-900 font-bold">{value}</p>
        </div>
    </div>
);