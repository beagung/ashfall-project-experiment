import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  // Auto scroll instan saat pindah rute
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Pantau posisi scroll untuk memunculkan tombol
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // FUNGSI SCROLL INTERAKTIF (Lambat & Halus)
  const scrollToTopManual = () => {
    const startPos = window.pageYOffset;
    const startTime = performance.now();
    const duration = 1500; // 1.5 detik (ubah ke 2000 jika ingin lebih lambat)

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animation = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      window.scrollTo(0, startPos * (1 - easeOutCubic(progress)));

      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  return (
    <div
      className={`fixed bottom-10 right-10 z-999 transition-all duration-1000 ease-in-out ${
        isVisible 
          ? "opacity-100 translate-y-0 scale-100" 
          : "opacity-0 translate-y-20 scale-50 pointer-events-none"
      }`}
    >
      <button
        onClick={scrollToTopManual}
        className="group relative flex items-center justify-center w-14 h-14 bg-zinc-900 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden border border-zinc-800"
      >
        {/* Background Hover Slide Effect */}
        <div className="absolute inset-0 bg-[#f97316] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
        
        {/* Icon Panah */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white relative z-10 group-hover:-translate-y-1 transition-transform duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>

        {/* Pulse Effect saat hover */}
        <div className="absolute inset-0 rounded-full border-2 border-[#f97316] opacity-0 group-hover:animate-ping" />
      </button>
    </div>
  );
};

export default ScrollToTop;