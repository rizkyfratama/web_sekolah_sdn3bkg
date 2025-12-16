import React, { useState, useEffect } from 'react';
import { Menu, X, GraduationCap, Phone, Mail, MapPin, Facebook, Instagram, Youtube, Settings, ExternalLink } from 'lucide-react';
import { NavItem } from '../types';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Iridescence } from './Iridescence';

const navItems: NavItem[] = [
  { label: 'Beranda', href: '/' },
  { label: 'Profil', href: '/profile' },
  { label: 'Guru & Staf', href: '/teachers' },
  { label: 'Galeri', href: '/gallery' },
  { label: 'Berita', href: '/news' },
  { label: 'Buku Tamu', href: 'https://buku-tamu-sdn3kk-v2.vercel.app', isExternal: true },
];

const SCHOOL_LOGO = "https://drive.google.com/thumbnail?id=1pLGkKXicN0yojQDzJZAhYoEispFG0CrR&sz=w1000";

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  
  // State untuk Gooey Nav (Tracking Hover)
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen relative font-sans text-slate-900">
      
      {/* BACKGROUND LAYER */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Iridescence Background */}
        <Iridescence 
            color={[0.8, 0.7, 1.0]} // Soft Violet Tint
            mouseReact={false}
            amplitude={0.1}
            speed={0.7}
            className="w-full h-full opacity-60"
        />
        
        {/* Overlay Transparan */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>
        
        {/* Grid Pattern halus */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.1] mix-blend-multiply"></div>
      </div>

      {/* Navbar */}
      <header 
        className={`sticky top-0 z-50 w-full transition-all duration-500 ease-in-out ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] py-3 border-b border-white/40' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-4 group relative z-50">
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative w-12 h-12 flex items-center justify-center"
            >
                {!logoError && SCHOOL_LOGO ? (
                    <img 
                        src={SCHOOL_LOGO} 
                        alt="Logo Sekolah" 
                        className="w-full h-full object-contain relative z-10 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-500 drop-shadow-sm"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none'; 
                            setLogoError(true);
                        }}
                    />
                ) : (
                    <div className="bg-gradient-to-br from-violet-600 to-fuchsia-700 p-2 rounded-xl text-white shadow-lg flex items-center justify-center w-full h-full">
                        <GraduationCap size={24} />
                    </div>
                )}
            </motion.div>
            
            <div className="flex flex-col justify-center">
              <motion.span 
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-xs md:text-sm font-bold text-slate-600 tracking-[0.15em] uppercase leading-tight group-hover:text-violet-600 transition-colors duration-300 whitespace-nowrap"
              >
                SD NEGERI 3
              </motion.span>
              <motion.span 
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-none bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-fuchsia-600 transition-all duration-300"
              >
                BANGKUANG
              </motion.span>
            </div>
          </Link>

          {/* Desktop Gooey Nav */}
          <nav 
            className="hidden md:flex relative items-center bg-white/50 backdrop-blur-md border border-white/60 rounded-full p-1.5 shadow-sm"
            onMouseLeave={() => setHoveredPath(null)}
          >
            {navItems.map((item) => {
                const isActive = item.href === location.pathname;
                const isHovered = hoveredPath === item.href;
                const showBubble = hoveredPath ? isHovered : isActive;
                const shouldShowBubble = item.isExternal ? isHovered : showBubble;

                return (
                    <div key={item.label} className="relative z-10">
                         {shouldShowBubble && (
                            <motion.div
                                layoutId="gooey-pill"
                                className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full shadow-lg shadow-violet-500/20"
                                transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
                            />
                        )}
                        
                        {item.isExternal ? (
                            <a
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`relative block px-5 py-2 text-sm font-bold transition-colors duration-300 z-20 flex items-center gap-1.5 ${
                                    shouldShowBubble ? 'text-white' : 'text-slate-800 hover:text-violet-700'
                                }`}
                                onMouseEnter={() => setHoveredPath(item.href)}
                            >
                                {item.label}
                                <ExternalLink size={10} className={shouldShowBubble ? 'opacity-100' : 'opacity-40'} />
                            </a>
                        ) : (
                            <Link
                                to={item.href}
                                className={`relative block px-5 py-2 text-sm font-bold transition-colors duration-300 z-20 ${
                                    shouldShowBubble ? 'text-white' : 'text-slate-800 hover:text-violet-700'
                                }`}
                                onMouseEnter={() => setHoveredPath(item.href)}
                            >
                                {item.label}
                            </Link>
                        )}
                    </div>
                );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2.5 text-slate-700 hover:bg-white/50 rounded-xl transition active:scale-95"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl shadow-2xl border-t border-white/50 py-4 px-4 flex flex-col space-y-2 animate-in slide-in-from-top-5 z-40 origin-top">
            {navItems.map((item) => (
              item.isExternal ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-medium block py-3 px-4 rounded-xl text-slate-700 hover:bg-violet-50 hover:text-violet-600 flex items-center justify-between"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                  <ExternalLink size={16} className="opacity-50" />
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`text-base font-medium block py-3 px-4 rounded-xl transition ${
                     location.pathname === item.href 
                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30' 
                        : 'text-slate-700 hover:bg-slate-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/95 backdrop-blur-lg text-slate-300 py-20 relative z-10 overflow-hidden mt-auto border-t border-white/10">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-white">
               <div className="w-12 h-12 flex items-center justify-center bg-white p-1 rounded-xl shadow-lg shadow-white/10">
                 {!logoError && SCHOOL_LOGO ? (
                    <img src={SCHOOL_LOGO} alt="Logo" className="w-full h-full object-contain" onError={() => setLogoError(true)} />
                 ) : (
                    <GraduationCap size={28} className="text-violet-900" />
                 )}
               </div>
               <div className="flex flex-col">
                  <span className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase whitespace-nowrap">SD NEGERI 3</span>
                  <span className="text-xl font-black tracking-tight text-white uppercase">Bangkuang</span>
               </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Membentuk generasi penerus bangsa yang cerdas, berkarakter mulia, dan kompetitif di era global.
            </p>
            <div className="flex gap-3">
              <SocialButton icon={Facebook} color="hover:bg-[#1877F2]" />
              <SocialButton icon={Instagram} color="hover:bg-[#E4405F]" />
              <SocialButton icon={Youtube} color="hover:bg-[#FF0000]" />
            </div>
          </div>

          <div className="pl-0 md:pl-10">
            <h3 className="text-white font-bold mb-6 text-sm tracking-widest uppercase border-b-2 border-violet-600 w-fit pb-1">Tautan Cepat</h3>
            <ul className="space-y-3 text-sm">
              <li><FooterLink to="/profile">Visi & Misi</FooterLink></li>
              <li><FooterLink to="/teachers">Tenaga Pendidik</FooterLink></li>
              <li><FooterLink to="/news">Pengumuman Sekolah</FooterLink></li>
              <li><FooterLink to="/gallery">Galeri Kegiatan</FooterLink></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 text-sm tracking-widest uppercase border-b-2 border-violet-600 w-fit pb-1">Hubungi Kami</h3>
            <ul className="space-y-5 text-sm">
              <li className="flex items-start gap-4 group">
                <div className="bg-slate-800 p-2 rounded-lg group-hover:bg-violet-600 transition duration-300">
                    <MapPin size={18} className="text-violet-400 group-hover:text-white" />
                </div>
                <span className="leading-relaxed text-slate-400 group-hover:text-slate-200 transition">Bangkuang RT 22 RW 08, Kec. Karau Kuala, Kab. Barito Selatan</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="bg-slate-800 p-2 rounded-lg group-hover:bg-violet-600 transition duration-300">
                    <Phone size={18} className="text-violet-400 group-hover:text-white" />
                </div>
                <span className="text-slate-400 group-hover:text-slate-200 transition">(0513) 555-1234</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="bg-slate-800 p-2 rounded-lg group-hover:bg-violet-600 transition duration-300">
                    <Mail size={18} className="text-violet-400 group-hover:text-white" />
                </div>
                <span className="text-slate-400 group-hover:text-slate-200 transition break-all">sdn3karaukuala25@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-20 pt-8 flex flex-col md:flex-row justify-between items-center container mx-auto px-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Sekolah Dasar Negeri 3 Bangkuang. All rights reserved.</p>
          <Link to="/admin" className="flex items-center gap-2 hover:text-white transition mt-4 md:mt-0 bg-slate-800/50 px-4 py-2 rounded-full hover:bg-violet-600">
             <Settings size={14} /> <span>Akses Admin</span>
          </Link>
        </div>
      </footer>
    </div>
  );
};

// Sub-components for cleaner Footer
const SocialButton = ({ icon: Icon, color }: any) => (
    <a href="#" className={`bg-slate-800 p-3 rounded-xl text-slate-400 hover:text-white transition-all duration-300 hover:scale-110 ${color}`}>
        <Icon size={18} />
    </a>
);

const FooterLink = ({ to, children }: any) => (
    <Link to={to} className="hover:text-white transition-colors duration-200 flex items-center gap-2 group text-slate-400">
        <span className="w-1.5 h-1.5 bg-violet-600 rounded-full group-hover:scale-150 transition-transform"></span> 
        {children}
    </Link>
);