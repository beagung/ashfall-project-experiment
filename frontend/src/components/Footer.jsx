import React from 'react';
import { Link } from 'react-router-dom';
import logo3 from '../assets/img/logo3.png';

// Import Material UI Icons
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import XIcon from '@mui/icons-material/X';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CopyrightIcon from '@mui/icons-material/Copyright';

const Footer = () => {
  // Style ikon agar putih bersih dan berubah orange saat hover
  const iconStyle = { 
    fontSize: 22, 
    color: 'inherit', 
    transition: 'all 0.3s ease' 
  };

  return (
    // Background Hitam, Teks Putih, Border atas Putih
    <footer className="bg-black text-white py-16 px-6 md:px-24 font-sans border-t-2 border-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        
   {/* KOLOM KIRI (Navigasi & Copyright) */}
<div className="flex flex-col w-full md:w-1/2">
  <ul className="text-[11px] font-black uppercase tracking-[0.2em]">
    {/* Refund Policy */}
    <li className="border-b border-zinc-800 py-4 group">
      <Link to="/refund-policy" className="group-hover:text-[#f97316] transition-all flex justify-between items-center">
        Refund Policy <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
      </Link>
    </li>


    {/* FAQ */}
    <li className="border-b border-zinc-800 py-4 group">
      <Link to="/faq" className="group-hover:text-[#f97316] transition-all flex justify-between items-center">
        FAQ <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
      </Link>
    </li>


    {/* How To Order */}
    <li className="border-b border-zinc-800 py-4 group">
      <Link to="/how-to-orders" className="group-hover:text-[#f97316] transition-all flex justify-between items-center">
        How To Order <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
      </Link>
    </li>

  </ul>
  
  <div className="mt-10 flex items-center gap-1 text-[9px] text-zinc-500 uppercase tracking-[0.3em] font-bold">
    <span>Copyright</span>
    <CopyrightIcon sx={{ fontSize: 12 }} />
    <span>2025 - 2026 ASHFALL™ STUDIO.</span>
  </div>
</div>

        {/* KOLOM KANAN (Logo & Find Us On) */}
        <div className="flex flex-col items-center md:items-end w-full md:w-1/2 pt-2">
          
          {/* LOGO - Menggunakan invert agar logo hitam menjadi putih jika perlu */}
          <div className="mb-6">
            <img 
              src={logo3} 
              alt="Ashfall Logo" 
              className="h-14 md:h-20 w-auto object-contain brightness-0 invert hover:scale-105 transition-transform duration-500" 
            />
          </div>

          <h4 className="text-[10px] font-black mb-6 tracking-[0.4em] uppercase text-white border-b-2 border-[#f97316] pb-1">
            FIND US ON
          </h4>
          
          {/* Social Icons - Putih, Hover Orange */}
          <div className="flex flex-wrap justify-center md:justify-end gap-6 text-white">
            <a href="#" className="hover:text-[#f97316] hover:-translate-y-1 transition-all"><FacebookIcon sx={iconStyle} /></a>
            <a href="#" className="hover:text-[#f97316] hover:-translate-y-1 transition-all"><XIcon sx={iconStyle} /></a>
            <a href="#" className="hover:text-[#f97316] hover:-translate-y-1 transition-all"><InstagramIcon sx={iconStyle} /></a>
            <a href="#" className="hover:text-[#f97316] hover:-translate-y-1 transition-all"><YouTubeIcon sx={iconStyle} /></a>
            <a href="#" className="hover:text-[#f97316] hover:-translate-y-1 transition-all"><WhatsAppIcon sx={iconStyle} /></a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;