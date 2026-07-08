import React from 'react';

// Asset - Pastikan path file benar
import aboutImage from '../../assets/img/about2.jpg'; 
import backgroundAbout from '../../assets/img/backgroundshop.png'; 

const About = () => {
  return (
    <div 
      className="min-h-screen bg-fixed bg-cover bg-center text-black font-sans pb-20 uppercase font-bold"
      style={{ backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.92), rgba(255,255,255,0.92)), url(${backgroundAbout})` }}
    >
      
      {/* --- HERO HEADER --- */}
      <div className="bg-black text-white pt-32 pb-24 px-6 border-b-8 border-orange-500">
        <div className="max-w-7xl mx-auto">
          <p className="text-orange-500 font-black tracking-widest text-xs uppercase mb-4 italic animate-pulse">
            System_Profile // Chronicle_Origin
          </p>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter italic uppercase leading-none select-none">
            ABOUT US<span className="text-orange-500">.</span>
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-12">
        
        {/* --- MAIN CONTENT CARD --- */}
        <div className="group relative bg-white border-4 border-black shadow-2xl transition-all duration-500 flex flex-col overflow-hidden">
          
          {/* 1. IMAGE SECTION (Mepet Kanan Kiri dengan Garis Tepi Oranye) */}
          {/* border-b-4 border-orange-500 membuat garis bawah gambar berwarna oranye */}
          <div className="w-full aspect-video overflow-hidden border-b-8 border-orange-500 bg-zinc-900 relative">
            <img 
              src={aboutImage} 
              alt="Ashfall Core Identity" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 opacity-90 group-hover:opacity-100"
            />
            
            {/* Tag Overlay */}
            <div className="absolute top-6 left-6 bg-orange-500 text-black px-4 py-2 text-xs tracking-widest border border-black shadow-lg z-10 font-black italic">
              EST_2025 // IDENTITY_VISUAL
            </div>

            <div className="absolute inset-0 bg-orange-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"></div>
          </div>

          {/* 2. DESCRIPTION SECTION */}
          <div className="p-8 md:p-16 flex flex-col bg-white font-black relative overflow-hidden">
            
            {/* Dekorasi Background Text (ASH) */}
            <span className="absolute -bottom-10 -right-5 text-9xl text-zinc-100 opacity-30 italic select-none -z-10 font-black">
              ASH
            </span>

            <div className="mb-12 border-b-4 border-zinc-200 pb-8">
              <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-tight">
                THE MANIFESTO<span className="text-orange-500">.</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-sm normal-case font-bold text-zinc-800 leading-relaxed tracking-wide">
              
              {/* Kolom Kiri */}
              <div className="space-y-8">
                <section>
                  <h3 className="text-orange-600 uppercase font-black italic text-xl mb-3">01. THE ORIGIN</h3>
                  <p>
                    Lahir dari kegelapan subkultur dan energi mentah musik metal, hardcore, hingga punk, <span className="text-black font-black">ASHFALL</span> bukan sekadar merek merchandise. Kami adalah entitas yang mendokumentasikan pergerakan bawah tanah melalui estetika visual yang lugas dan fungsional. 
                  </p>
                </section>

                <section>
                  <h3 className="text-orange-600 uppercase font-black italic text-xl mb-3">02. THE VISION</h3>
                  <p>
                    Visi kami adalah menciptakan ekosistem di mana seni visual bertemu dengan semangat independensi. Kami percaya bahwa setiap distorsi gitar dan teriakan vokal memiliki bentuk visualnya sendiri. Melalui platform ini, ASHFALL mengarsipkan esensi tersebut ke dalam narasi digital yang abadi.
                  </p>
                </section>
                
                <p className="bg-zinc-50 p-6 border-l-8 border-orange-500 italic text-zinc-600 shadow-inner">
                  "Kami tidak mengejar tren; kami mengejar kebenaran di balik kebisingan yang nyata."
                </p>
              </div>

              {/* Kolom Kanan */}
              <div className="space-y-8">
                <section>
                  <h3 className="text-orange-600 uppercase font-black italic text-xl mb-3">03. COLLABORATIVE</h3>
                  <p>
                    Fokus utama kami adalah kolaborasi. ASHFALL bekerja sama erat dengan band lokal, kolektif seni, dan komunitas musik mandiri untuk menciptakan rilisan eksklusif. Kami memberikan ruang bagi identitas lokal untuk bersinar dalam balutan desain yang modern, brutal, namun tetap profesional.
                  </p>
                </section>

                <blockquote className="bg-zinc-900 p-8 font-black italic uppercase text-2xl text-white border-r-8 border-orange-500 shadow-xl">
                  WE DOCUMENT THE NOISE, THE GRIT, AND THE UNDENIABLE TRUTH.
                </blockquote>

                <section>
                  <h3 className="text-orange-600 uppercase font-black italic text-xl mb-3">04. CORE SYSTEM</h3>
                  <p>
                    Sebagai platform yang dikembangkan secara mandiri, kami mengintegrasikan teknologi modern untuk memastikan setiap interaksi pengguna berjalan lancar, aman, dan efisien—seperti halnya presisi di balik komposisi musik yang hebat.
                  </p>
                </section>
              </div>
            </div>

            {/* Footer Kartu */}
            <div className="mt-20 pt-10 border-t-4 border-black flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex flex-wrap gap-10">
                <div>
                  <span className="text-zinc-400 block text-xs tracking-widest mb-1">DATA_STREAM</span>
                  <span className="text-sm font-black">ESTABLISHED_2025</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-xs tracking-widest mb-1">LOCAL_SECTOR</span>
                  <span className="text-sm font-black">INDONESIA_CORE</span>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-black"></div>
                <div className="w-8 h-8 bg-orange-500"></div>
                <div className="w-8 h-8 bg-zinc-200"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;