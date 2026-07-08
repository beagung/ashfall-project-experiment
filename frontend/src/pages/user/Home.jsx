import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Swiper Components & Styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// Material UI Icons
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import GppGoodIcon from '@mui/icons-material/GppGood';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import HandshakeIcon from '@mui/icons-material/Handshake';

// Assets
import aboutImage from '../../assets/img/home.png';
import aboutBanner from '../../assets/img/about.png';
import shirtImage from '../../assets/img/shirt1.png';
import backgroundShop from '../../assets/img/backgroundshop.png';

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [collaborations, setCollaborations] = useState([]); // State baru untuk kolaborasi
  const [loading, setLoading] = useState(true);
  const [loadingTesti, setLoadingTesti] = useState(true);
  const [loadingCollab, setLoadingCollab] = useState(true); // Loading khusus kolaborasi

  const API_PRODUCTS = 'http://localhost:5000/api/products';
  const API_CONTACT = 'http://localhost:5000/api/contact'; 
  const API_COLLABORATIONS = 'http://localhost:5000/api/collaborations'; // API Kolaborasi

  useEffect(() => {
    // Fetch Products
    const fetchTrending = async () => {
      try {
        setLoading(true);
        const res = await axios.get(API_PRODUCTS);
        setProducts(res.data.slice(0, 3));
      } catch (err) {
        console.error("Gagal memuat produk:", err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch Testimonials (Data dari Contact Messages)
    const fetchTestimonials = async () => {
      try {
        setLoadingTesti(true);
        const res = await axios.get(API_CONTACT);
        if (res.data.success) {
          setTestimonials(res.data.data.slice(0, 3));
        }
      } catch (err) {
        console.error("Gagal memuat testimoni:", err);
      } finally {
        setLoadingTesti(false);
      }
    };

    // Fetch Collaborations
    const fetchCollaborations = async () => {
      try {
        setLoadingCollab(true);
        const res = await axios.get(API_COLLABORATIONS);
        const rawData = Array.isArray(res.data) ? res.data : (res.data.data || []);
        // Mengambil 3 data kolaborasi terbaru
        setCollaborations(rawData.slice(0, 3));
      } catch (err) {
        console.error("Gagal memuat kolaborasi:", err);
      } finally {
        setLoadingCollab(false);
      }
    };

    fetchTrending();
    fetchTestimonials();
    fetchCollaborations();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black font-sans uppercase font-bold">
      
      {/* --- SECTION 1: HERO --- */}
      <section className="relative h-screen bg-zinc-900 border-b-8 border-zinc-900 overflow-hidden">
        <div className="relative w-full h-full">
          <img 
            src={aboutImage} 
            className="w-full h-full object-cover opacity-80 transition-all duration-1000"
            alt="Hero Header"
          />
          <div className="absolute inset-0 bg-black opacity-30"></div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6 text-center z-10">
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-tight max-w-5xl mb-10">
              WELCOME TO ASHFALL MERCHANDISE, DROP YOUR HEART, WEAR YOUR SOUL
            </h2>
            <button 
              onClick={() => navigate('/shop')}
              className="bg-black text-white px-12 py-4 border-4 border-black font-black hover:bg-white hover:text-black transition-all shadow-xl"
            >
              SHOP NOW
            </button>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: INFO BANNERS --- */}
      <section className="py-16 bg-white border-b-4 border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center group">
  <HandshakeIcon sx={{ fontSize: 40 }} className="mb-4 group-hover:text-orange-500 transition-colors" />
  <h4 className="text-sm font-black tracking-widest">COLLABORATIONS</h4>
  <p className="text-xs text-zinc-400 normal-case mt-1 font-bold">JOIN THE NETWORK</p>
</div>
          <div className="text-center group">
            <GppGoodIcon sx={{ fontSize: 40 }} className="mb-4 group-hover:text-orange-500 transition-colors" />
            <h4 className="text-sm font-black tracking-widest">SECURE PAYMENT</h4>
            <p className="text-xs text-zinc-400 normal-case mt-1 font-bold">TRUSTED GATEWAY</p>
          </div>
          <div className="text-center group">
            <SupportAgentIcon sx={{ fontSize: 40 }} className="mb-4 group-hover:text-orange-500 transition-colors" />
            <h4 className="text-sm font-black tracking-widest">EXCELLENT SERVICE</h4>
            <p className="text-xs text-zinc-400 normal-case mt-1 font-bold">24/7 CUSTOMER INFO</p>
          </div>
          <div className="text-center group">
            <WorkspacePremiumIcon sx={{ fontSize: 40 }} className="mb-4 group-hover:text-orange-500 transition-colors" />
            <h4 className="text-sm font-black tracking-widest">QUALITY ASSURED</h4>
            <p className="text-xs text-zinc-400 normal-case mt-1 font-bold">PREMIUM ARCHIVE</p>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: TRENDING PRODUCTS --- */}
      <section className="py-18 max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-black text-center mb-16 tracking-tighter italic">ASHFALL NEWEST PRODUCTS</h2>
        {loading ? (
          <div className="text-center py-20 font-black animate-pulse">LOADING_DATA...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="group border-4 border-black p-4 bg-white shadow-xl hover:shadow-orange-500 transition-all cursor-pointer"
                onClick={() => navigate(`/shop/detail-products/${product.id}`)}
              >
                <div className="aspect-square bg-zinc-100 mb-6 overflow-hidden border-2 border-black relative">
                  <img 
                    src={product.images?.[0] || aboutImage} 
                    className="w-full h-full object-cover transition-all duration-700" 
                    alt={product.name} 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ShoppingBagIcon className="text-white scale-150" />
                  </div>
                </div>
                <p className="text-zinc-400 text-xs mb-1">ID_{String(product.id).slice(-4)}</p>
                <h3 className="text-xl font-black mb-2 truncate uppercase">{product.name}</h3>
                <p className="text-orange-600 text-2xl font-black">
                  IDR {product.price.toLocaleString('id-ID')}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- SECTION 4: FLASH SALE BANNER --- */}
      <section className="relative h-96 border-y-8 border-black overflow-hidden bg-zinc-900">
        <img 
          src={aboutBanner} 
          className="w-full h-full object-cover brightness-50 transition-transform duration-1000 hover:scale-105" 
          alt="Flash Sale Banner" 
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            FLASH SALE: UP TO 20% OFF
          </h2>
          <p className="max-w-xl mb-8 tracking-widest text-sm font-bold">
            ON SELECTED ITEMS ONLY. ACCESS THE CORE COLLECTION NOW.
          </p>
          <button 
            onClick={() => navigate('/shop')} 
            className="bg-white text-black px-12 py-4 border-4 border-black font-black hover:bg-black hover:text-white transition-all shadow-xl"
          >
            COLLECT NOW
          </button>
        </div>
      </section>

      {/* --- SECTION 5: FEATURED ITEM --- */}
      <section className="py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="border-8 border-black shadow-2xl shadow-orange-500 overflow-hidden aspect-square">
          <img 
            src={shirtImage} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" 
            alt="Featured Shirt" 
          />
        </div>
        <div className="space-y-8">
          <h2 className="text-6xl font-black tracking-tighter leading-none">ASHFALL T-SHIRT BLACK</h2>
          <p className="text-zinc-600 normal-case font-bold leading-relaxed">
            ASHFALL T-SHIRT BLACK adalah kaos berwarna hitam dengan desain modern yang terinspirasi dari nuansa abu vulkanik yang kuat dan misterius. 
            Dibuat dari bahan berkualitas tinggi yang lembut dan nyaman dipakai sehari-hari, kaos ini cocok untuk berbagai aktivitas, baik santai maupun kasual. 
            Dengan tampilan minimalis namun tetap stylish, ASHFALL T-SHIRT BLACK memberikan kesan bold dan elegan bagi penggunanya.
          </p>
          <div className="flex gap-20 py-8 border-y-4 border-black">
            <div>
              <p className="text-zinc-400 text-xs">STOCK_STATUS</p>
              <p className="text-4xl font-black">50%</p>
            </div>
            <div>
              <p className="text-zinc-400 text-xs">UNITS_SOLD</p>
              <p className="text-4xl font-black">1000</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 6: OUR COLLABORATIONS (Updated from Popular Products) --- */}
      <section className="py-24 bg-zinc-50 border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black mb-16 tracking-tighter italic">OUR COLLABORATIONS</h2>
          {loadingCollab ? (
            <div className="text-center py-20 font-black animate-pulse">ACCESSING_COLLAB_DATA...</div>
          ) : collaborations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {collaborations.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white border-4 border-black p-6 group hover:shadow-[12px_12px_0px_#f97316] transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  onClick={() => navigate(`/collaborations/detail/${item.id}`)}
                >
                  <div>
                    <div className="aspect-square bg-zinc-900 mb-6 border-2 border-black overflow-hidden relative">
                      <img 
                        src={item.image || 'https://via.placeholder.com/800x800?text=NO_IMAGE'} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                        alt={item.name} 
                      />
                      <div className="absolute top-3 left-3 bg-[#f97316] text-black px-2 py-0.5 text-[8px] tracking-widest border border-black font-black uppercase">
                        {item.type || 'COLLAB_PROJ'}
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-400 block mb-1 text-left">
                      UID: {String(item.id).slice(0, 8).toUpperCase()}
                    </span>
                    <h3 className="text-xl font-black mb-2 tracking-tight text-left truncate uppercase">
                      {item.name}
                    </h3>
                    <p className="text-zinc-600 normal-case font-bold text-xs text-left line-clamp-3 mb-6">
                      {item.description}
                    </p>
                  </div>
                  
                  <button className="w-full py-3 bg-black text-white group-hover:bg-[#f97316] group-hover:text-black border-2 border-black font-black text-xs transition-colors tracking-wider flex items-center justify-center gap-2">
                    <RemoveRedEyeIcon fontSize="small" /> VIEW_DETAILS
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-4 border-dashed border-zinc-300 font-black italic text-zinc-400">
              NO_ACTIVE_COLLABORATIONS_FOUND
            </div>
          )}
        </div>
      </section>

      {/* --- SECTION 7: TESTIMONIALS --- */}
      <section className="py-24 bg-black text-white border-y-8 border-white-500">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          {loadingTesti ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="bg-zinc-900 h-64 border-4 border-zinc-800 animate-pulse"></div>
            ))
          ) : testimonials.length > 0 ? (
            testimonials.map((item) => (
              <div key={item.id} className="bg-white text-black p-8 border-4 border-orange-500 relative shadow-[12px_12px_0px_#f97316]">
                <div className="text-orange-500 text-4xl font-black mb-4" style={{ fontStyle: 'italic' }}>"</div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-orange-600 mb-2 truncate">
                  SUBJECT: {item.subject}
                </h3>
                <p className="text-sm normal-case font-bold leading-relaxed mb-10 text-zinc-700 line-clamp-4 italic" style={{ fontStyle: 'italic' }}>
                  {item.message}
                </p>
                <div className="flex items-center gap-4 border-t-2 border-dashed border-zinc-200 pt-6">
                  <div className="w-10 h-10 bg-black flex items-center justify-center text-white font-black text-xs uppercase">
                    {item.full_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase">{item.full_name}</p>
                    <p className="text-orange-600 text-[10px] tracking-widest">VERIFIED_USER</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-10 italic text-zinc-500">
              NO_VOICE_IN_DATABASE_YET
            </div>
          )}
        </div>
      </section>

      {/* --- SECTION 8: READY TO FIND --- */}
      <section className="relative h-80 border-b-8 border-white overflow-hidden">
        <img 
          src={backgroundShop} 
          className="w-full h-full object-cover brightness-50 transition-transform duration-1000 hover:scale-105" 
          alt="Ready to Shop Background" 
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 text-center leading-tight">
            READY TO FIND YOUR FAVORITE ITEM?
          </h2>
          <button 
            onClick={() => navigate('/shop')} 
            className="bg-white text-black px-16 py-4 border-4 border-black font-black hover:bg-black hover:text-white transition-all shadow-xl"
          >
            FIND NOW
          </button>
        </div>
      </section>

    </div>
  );
};

export default Home;