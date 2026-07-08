import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from 'axios';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MenuIcon from '@mui/icons-material/Menu';
import LogoImg from "../assets/img/logo2.png";

const Navbar = () => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // --- LOGIC AUTH ---
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

   const handleLogout = async () => {
  try {
    // Memanggil API backend untuk mematikan sesi di server
    await axios.post('http://localhost:5000/api/auth/logout'); 
  } catch (err) {
    console.error("Gagal memanggil logout API, tetap melanjutkan proses lokal:", err);
  } finally {
    // Tetap bersihkan data lokal meskipun API gagal (untuk antisipasi network error)
    localStorage.removeItem('user');
    setUser(null);
    setIsProfileOpen(false);
    
    // Trigger agar komponen lain update
    window.dispatchEvent(new Event('userUpdated'));
    
    navigate("/");
  }
};

  // --- LOGIC SYNC KERANJANG ---
  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCart);
  };

  useEffect(() => {
    loadCart();
    const handleStorageChange = () => loadCart();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => {
    const priceAfterDiscount = item.price - (item.price * (item.discount / 100));
    return acc + (priceAfterDiscount * item.quantity);
  }, 0);

  const removeItem = (id, selectedSize) => {
    const updatedCart = cartItems.filter(
      item => !(item.id === id && item.selectedSize === selectedSize)
    );
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    window.dispatchEvent(new Event('storage'));
  };

  useEffect(() => {
    document.body.style.overflow = (isCartOpen || isProfileOpen) ? 'hidden' : 'unset';
  }, [isCartOpen, isProfileOpen]);

  const linkStyle = ({ isActive }) =>
    `transition-all pb-1 border-b-2 font-black tracking-[0.2em] ${
      isActive ? "border-[#f97316] text-white" : "border-transparent text-white hover:text-[#f97316]"
    }`;

  const handleViewCart = () => {
    setIsCartOpen(false);
    navigate("/cart");
  };

  const mainNav = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Shop", path: "/shop" },
    { name: "Journal", path: "/journal" },
    { name: "Collaboration", path: "/gallery/collaboration" },
  ];

  const galleryLinks = [
    { name: "Issues", path: "/gallery/issues" },
    { name: "Videos", path: "/gallery/videos" },
  ];


  return (
    <>
      <nav className="w-full bg-black border-b-2 border-white sticky top-0 z-50 font-sans uppercase">
        <div className="w-full px-4 md:px-8">
          <div className="flex items-center justify-between py-1 h-16 md:h-20">
            <div className="flex items-center">
              <NavLink to="/" className="block">
                <img src={LogoImg} alt="Logo" className="h-8 md:h-12 w-auto object-contain block brightness-0 invert" />
              </NavLink>
            </div>

            <div className="flex items-center gap-4 md:gap-7 text-[10px] md:text-[11px] font-bold">
              <div className="hidden lg:flex items-center gap-6">
                {mainNav.map((link) => (
                  <NavLink key={link.path} to={link.path} className={linkStyle}>
                    {link.name}
                  </NavLink>
                ))}
                <div 
                  className="relative group" 
                  onMouseEnter={() => setIsGalleryOpen(true)} 
                  onMouseLeave={() => setIsGalleryOpen(false)}
                >
                  <div className={`flex items-center gap-1 cursor-pointer transition-colors pb-1 border-b-2 ${isGalleryOpen ? 'border-[#f97316] text-[#f97316]' : 'border-transparent text-white hover:text-[#f97316]'}`}>
                    <span className="font-black tracking-[0.2em]">Gallery</span>
                    <svg className={`w-2.5 h-2.5 transition-transform duration-300 ${isGalleryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {isGalleryOpen && (
                    <div className="absolute left-0 mt-0 w-48 bg-black border-2 border-white shadow-[6px_6px_0px_#f97316] z-60">
                      <div className="flex flex-col py-0">
                        {galleryLinks.map((link) => (
                          <NavLink key={link.path} to={link.path} className="px-4 py-3 border-b border-zinc-900 text-white hover:bg-[#f97316] hover:text-black transition-all font-black text-[9px] tracking-widest">
                            {link.name}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <NavLink to="/contact" className={linkStyle}>Contact</NavLink>
                <NavLink to="/stores" className={linkStyle}>Stores</NavLink>
              </div>

              <span className="text-zinc-700 text-xl font-thin select-none hidden sm:block">|</span>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => { setIsCartOpen(true); setIsProfileOpen(false); }} 
                  className="relative flex items-center group cursor-pointer"
                >
                  <ShoppingCartOutlinedIcon sx={{ fontSize: 22, color: 'white', '&:hover': { color: '#f97316' } }} />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 text-[9px] font-black bg-[#f97316] text-white px-1.5 py-0.5 border border-white animate-bounce">
                      {totalItems}
                    </span>
                  )}
                </button>

                <select className="bg-black text-white text-[9px] py-1.5 pl-3 pr-2 border-2 border-white cursor-pointer font-black shadow-[3px_3px_0px_#f97316] outline-none">
                  <option value="IDR">IDR</option>
                </select>

                
<button 
  onClick={() => { setIsProfileOpen(true); setIsCartOpen(false); }} 
  className="shrink-0 flex items-center justify-center transition-all cursor-pointer text-white hover:text-[#f97316]"
>
  <MenuIcon sx={{ fontSize: 28 }} />
</button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/80 z-60 transition-opacity duration-300 ${(isCartOpen || isProfileOpen) ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => { setIsCartOpen(false); setIsProfileOpen(false); }}
      />

      {/* --- SIDEBAR CART --- */}
      <aside className={`fixed top-0 right-0 h-full w-[320px] md:w-400px bg-white text-black z-70 transition-transform duration-500 ease-in-out border-l-8 border-black shadow-[-20px_0px_60px_rgba(0,0,0,0.5)] ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex justify-between items-center p-6 border-b-4 border-black bg-[#f97316]">
          <h2 className="font-black italic uppercase text-xl tracking-tighter">Manifesto_Cart</h2>
          <button onClick={() => setIsCartOpen(false)} className="hover:rotate-90 transition-transform">
            <CloseIcon sx={{ fontSize: 32, color: 'black' }} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto h-[calc(100vh-250px)] scrollbar-hide">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-20 italic font-black uppercase text-center space-y-4">
              <ShoppingCartOutlinedIcon sx={{ fontSize: 60 }} />
              <p className="text-sm tracking-widest">Your_Archive_Is_Empty</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 border-b-2 border-zinc-100 pb-4 group">
                  <div className="w-20 h-24 bg-zinc-100 border-2 border-black overflow-hidden shrink-0 shadow-[4px_4px_0px_#000]">
                    <img src={item.image || item.images?.[0]} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-black uppercase text-xs leading-tight truncate italic">{item.name}</h4>
                      <button onClick={() => removeItem(item.id, item.selectedSize)} className="text-zinc-300 hover:text-red-600 transition-colors">
                        <DeleteOutlineIcon fontSize="small" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[8px] bg-black text-white px-1 font-black">SIZE: {item.selectedSize}</span>
                      <p className="text-[9px] text-[#f97316] font-bold uppercase truncate">{item.category}</p>
                    </div>
                    <div className="flex justify-between items-end mt-4">
                      <p className="font-bold text-[10px] bg-zinc-100 px-2 py-0.5 border border-black italic">QTY: {item.quantity}</p>
                      <p className="font-black text-sm tracking-tighter">IDR { (item.price - (item.price * (item.discount / 100))).toLocaleString('id-ID') }</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="absolute bottom-0 left-0 w-full p-6 bg-black text-white border-t-4 border-[#f97316]">
            <div className="flex justify-between mb-4 font-black uppercase tracking-tighter text-xl italic">
              <span className="text-zinc-500">Subtotal:</span>
              <span className="text-[#f97316]">IDR {totalPrice.toLocaleString('id-ID')}</span>
            </div>
            <button onClick={handleViewCart} className="w-full bg-[#f97316] text-black py-4 font-black uppercase text-xs hover:bg-white transition-all shadow-[4px_4px_0px_#555] active:translate-y-1 active:shadow-none">
              Process_To_Checkout
            </button>
          </div>
        )}
      </aside>

{/* --- SIDEBAR PROFILE --- */}
<aside className={`fixed top-0 right-0 h-full w-[320px] bg-white text-black z-70 transition-transform duration-500 ease-in-out border-l-8 border-black shadow-[-20px_0px_60px_rgba(0,0,0,0.5)] ${isProfileOpen ? "translate-x-0" : "translate-x-full"}`}>
  {/* Header */}
  <div className="flex justify-between items-center p-6 border-b-4 border-black bg-[#f97316]">
    <h2 className="font-black italic uppercase text-xl tracking-tighter">Account</h2>
    <button onClick={() => setIsProfileOpen(false)} className="hover:rotate-90 transition-transform duration-300">
      <CloseIcon sx={{ fontSize: 32, color: 'black' }} />
    </button>
  </div>
  
  {/* Content */}
  <div className="p-8 flex flex-col h-[calc(100vh-85px)]">
    <div className="flex flex-col space-y-8">
      
      {/* Navigation Buttons */}
      <div className="w-full space-y-4">
        {user ? (
          <>
            <NavLink 
              to={`/profile/${user.id}`} 
              onClick={() => setIsProfileOpen(false)} 
              className="block w-full py-4 border-2 border-black text-center font-black uppercase hover:bg-black hover:text-white transition-all duration-300"
            >
              My Profile
            </NavLink>
            <NavLink 
              to="/orders" 
              onClick={() => setIsProfileOpen(false)} 
              className="block w-full py-4 border-2 border-black text-center font-black uppercase hover:bg-black hover:text-white transition-all duration-300"
            >
              Orders
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/login-customer" onClick={() => setIsProfileOpen(false)} className="block w-full py-4 border-2 border-black text-center font-black uppercase hover:bg-black hover:text-white transition-all duration-300">Login</NavLink>
            <NavLink to="/register-customer" onClick={() => setIsProfileOpen(false)} className="block w-full py-4 bg-black text-white text-center font-black uppercase hover:bg-[#f97316] transition-all duration-300">Register</NavLink>
          </>
        )}
      </div>
    </div>

    {/* Logout Button */}
    {user && (
      <button 
        onClick={handleLogout} 
        className="mt-auto w-full py-4 border-2 border-black bg-white text-black font-black uppercase hover:bg-red-600 hover:text-white transition-all duration-300 shadow-[4px_4px_0px_#000] active:shadow-none active:translate-y-1"
      >
        Logout
      </button>
    )}
  </div>
</aside>
    </>
  );
};

export default Navbar;