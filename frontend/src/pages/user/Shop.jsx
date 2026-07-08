import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';

// Asset
import backgroundShop from '../../assets/img/backgroundshop.png'; 

const Shop = () => {
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL_ARCHIVE');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [selectedProductForSize, setSelectedProductForSize] = useState(null);
  const dropdownRef = useRef(null);

  const API_PRODUCTS = 'http://localhost:5000/api/products';
  const API_CATEGORIES = 'http://localhost:5000/api/categories';

  const openSizeSelector = (e, product) => {
    e.stopPropagation(); 
    setSelectedProductForSize(product);
  };

  // --- LOGIC TAMBAH KE KERANJANG (FIXED FROM OBJECT INJECTION) ---
  const handleConfirmAddToCart = (size) => {
    const product = selectedProductForSize;
    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    const productId = product.id_product || product.id;
    
    const existingIndex = currentCart.findIndex(
      item => (item.id_product === productId || item.id === productId) && item.selectedSize === size
    );

    if (existingIndex > -1) {
      currentCart[existingIndex].quantity += 1;
    } else {
      currentCart.push({ 
        ...product, 
        id_product: productId, // memastikan ID seragam di cart
        selectedSize: size, 
        // 🟢 PERBAIKAN: Amankan category & issues agar menjadi string murni di localStorage
        category: typeof product.category === 'object' ? product.category?.name : product.category,
        issues: product.issues ? (typeof product.issues === 'object' ? product.issues.name : product.issues) : "N/A",
        image: product.images?.[0] || product.image_url, // Menyediakan fallback image tunggal untuk UI Cart
        quantity: 1 
      });
    }

    localStorage.setItem('cart', JSON.stringify(currentCart));
    window.dispatchEvent(new Event('storage'));
    
    setSelectedProductForSize(null);
    alert("ITEM_ADDED_TO_MANIFEST");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resProd, resCat] = await Promise.all([
          axios.get(API_PRODUCTS),
          axios.get(API_CATEGORIES)
        ]);
        
        const rawProducts = Array.isArray(resProd.data) ? resProd.data : (resProd.data.data || []);
        const rawCategories = Array.isArray(resCat.data) ? resCat.data : (resCat.data.data || []);

        setProducts(rawProducts);
        setCategories(rawCategories);
      } catch (err) {
        console.error("SYNC_ERROR:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const prodCatName = typeof product.category === 'object' ? product.category?.name : product.category;
    const matchesCategory = activeCategory === 'ALL_ARCHIVE' || prodCatName === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div 
      className="min-h-screen bg-fixed bg-cover bg-center text-black font-sans pb-20 uppercase font-bold"
      style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(${backgroundShop})` }}
    >
      
      {/* --- QUICK SIZE SELECTOR MODAL --- */}
      {selectedProductForSize && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedProductForSize(null)}></div>
          <div className="relative bg-white border-4 border-black p-8 max-w-md w-full shadow-[15px_15px_0px_#f97316] animate-in fade-in zoom-in duration-200">
            <button onClick={() => setSelectedProductForSize(null)} className="absolute -top-4 -right-4 bg-black text-white p-2 border-4 border-black hover:bg-[#f97316] hover:text-black transition-colors">
              <CloseIcon />
            </button>
            <p className="text-[#f97316] font-black tracking-[0.4em] text-[10px] mb-2 italic">ACTION // SELECT_SIZE</p>
            <h2 className="text-3xl font-black italic mb-6 leading-none uppercase">{selectedProductForSize.name}</h2>
            
            <div className="space-y-3">
              {['S', 'M', 'L', 'XL', 'XXL'].map((size) => {
                const stock = selectedProductForSize.sizes?.[size] || selectedProductForSize[size.toLowerCase()] || 0;
                const isOutOfStock = stock <= 0;

                return (
                  <button
                    key={size}
                    disabled={isOutOfStock}
                    onClick={() => handleConfirmAddToCart(size)}
                    className={`w-full flex items-center justify-between border-4 border-black p-4 transition-all ${
                      isOutOfStock ? 'opacity-20 grayscale cursor-not-allowed bg-zinc-100' : 'hover:bg-black hover:text-[#f97316] hover:translate-x-1 hover:translate-y-1 hover:shadow-none'
                    }`}
                  >
                    <span className="text-xl font-black italic">SIZE_{size}</span>
                    <span className="text-[10px] font-black uppercase">{isOutOfStock ? 'OUT_OF_STOCK' : `STOCK_AVAILABLE: ${stock}`}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* --- HERO HEADER --- */}
      <div className="bg-black text-white pt-28 pb-20 px-6 border-b-12px border-[#f97316]">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#f97316] font-black tracking-[0.6em] text-[10px] uppercase mb-4 italic animate-pulse">Terminal // Inventory_Loaded</p>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter italic uppercase leading-none select-none">SHOP NOW<span className="text-[#f97316]">.</span></h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-10">
        {/* --- CONTROLS SECTION --- */}
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div className="flex items-center gap-4 bg-white border-4 border-black p-5 shadow-[10px_10px_0px_#000] w-full lg:max-w-xl">
            <SearchIcon sx={{ fontSize: 32 }} />
            <input 
              type="text" 
              placeholder="SEARCH_MANIFESTO..."
              className="w-full outline-none font-black text-xl uppercase placeholder:text-zinc-400 bg-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative w-full sm:w-72" ref={dropdownRef}>
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full bg-[#f97316] text-black border-4 border-black p-5 flex items-center justify-between font-black text-sm tracking-widest uppercase shadow-[10px_10px_0px_#000] hover:bg-black hover:text-white transition-all">
              <div className="flex items-center gap-2">
                <TuneIcon sx={{ fontSize: 20 }} />
                <span>{activeCategory}</span>
              </div>
              <KeyboardArrowDownIcon className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 w-full bg-white border-4 border-black mt-2 z-50 shadow-[10px_10px_0px_#000] overflow-hidden">
                <div className="p-4 hover:bg-black hover:text-white cursor-pointer font-black text-xs uppercase tracking-widest border-b-2 border-zinc-100" onClick={() => { setActiveCategory('ALL_ARCHIVE'); setIsDropdownOpen(false); }}>
                  ALL_ARCHIVE
                </div>
                {categories.map((cat, idx) => (
                  <div 
                    key={cat.id_category || cat.id || cat.slug || idx}
                    className="p-4 hover:bg-black hover:text-[#f97316] cursor-pointer font-black text-xs uppercase tracking-widest border-b-2 border-zinc-100 last:border-0"
                    onClick={() => { setActiveCategory(cat.name); setIsDropdownOpen(false); }}
                  >
                    {cat.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* --- GRID SYSTEM --- */}
        <div className="mt-20">
          {loading ? (
            <div className="text-center py-20 font-black italic uppercase tracking-widest animate-pulse">DECRYPTING_DATA...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 border-4 border-dashed border-black font-black italic uppercase tracking-widest bg-white/50">NO_PRODUCTS_FOUND_IN_THIS_SECTOR.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 items-stretch">
              {filteredProducts.map((product, index) => {
                const currentId = product.id_product || product.id || index;
                const displayCategory = typeof product.category === 'object' ? product.category?.name : product.category;

                return (
                  <div 
                    key={currentId}
                    className="group relative bg-white border-4 border-black hover:shadow-[15px_15px_0px_#f97316] transition-all duration-300 cursor-pointer flex flex-col h-full"
                    onClick={() => navigate(`/shop/detail-products/${currentId}`)}
                  >
                    {product.discount > 0 && (
                      <div className="absolute top-0 right-0 z-10 bg-black text-[#f97316] font-black italic px-4 py-2 text-xs border-l-4 border-b-4 border-black">-{product.discount}%</div>
                    )}

                    <div className="aspect-4/5 overflow-hidden border-b-4 border-black bg-zinc-100 relative shrink-0">
                      <img 
                        src={Array.isArray(product.images) ? product.images[0] : (product.image_url || '/placeholder.png')} 
                        alt={product.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                      />
                      <button onClick={(e) => openSizeSelector(e, product)} className="absolute bottom-0 left-0 w-full bg-black text-white py-4 font-black uppercase text-xs translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2 hover:bg-[#f97316] hover:text-black z-20">
                        <ShoppingBagIcon sx={{ fontSize: 18 }} /> SELECT_SIZE
                      </button>
                    </div>

                    <div className="p-6 flex flex-col justify-between flex-1 bg-white font-black">
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[9px] text-[#f97316] tracking-[0.3em] uppercase">
                            {displayCategory || "UNCACHED"}
                          </span>
                          <span className="text-[8px] text-zinc-400 italic">ID_{String(currentId).slice(-6).toUpperCase()}</span>
                        </div>
                        <h3 className="text-2xl italic uppercase leading-tight group-hover:underline decoration-4 underline-offset-4">{product.name}</h3>
                      </div>
                      <div className="mt-auto">
                        <p className="text-xl">IDR { (product.price - (product.price * (product.discount / 100))).toLocaleString('id-ID') }</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;