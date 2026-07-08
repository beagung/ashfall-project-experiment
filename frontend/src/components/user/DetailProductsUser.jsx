import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PaymentsIcon from '@mui/icons-material/Payments';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LabelIcon from '@mui/icons-material/Label'; 

const ProductDetailUser = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        const fetchedData = response.data?.data || response.data;
        setProduct(fetchedData);
      } catch (err) {
        console.error("FETCH_ERROR:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProductDetail();
  }, [id]);

  // --- LOGIC TAMBAH KE KERANJANG (FIXED FROM OBJECT INJECTION) ---
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("CRITICAL_ERROR: PLEASE_SELECT_SIZE_BEFORE_PROCEEDING");
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const productId = product.id_product || product.id || id;
    const availableStock = product.sizes?.[selectedSize] || product[selectedSize.toLowerCase()] || 0;

    const existingIndex = cart.findIndex(item => 
      (item.id_product === productId || item.id === productId) && item.selectedSize === selectedSize
    );

    if (existingIndex > -1) {
      if (cart[existingIndex].quantity < availableStock) {
        cart[existingIndex].quantity += 1;
      } else {
        alert("MAX_STOCK_REACHED: ONLY " + availableStock + " PCS AVAILABLE");
        return;
      }
    } else {
      cart.push({
        ...product, // Menyimpan properti dasar produk
        id_product: productId, // Memastikan key seragam untuk komponen Navbar & Cart
        selectedSize: selectedSize,
        // Amankan category agar menjadi string murni di localStorage
        category: typeof product.category === 'object' ? product.category?.name : product.category,
        // FIX: Amankan properti issues agar tidak masuk sebagai objek utuh yang merusak komponen lain
        issues: product.issues ? (typeof product.issues === 'object' ? product.issues.name : product.issues) : "N/A",
        image: product.images?.[0] || product.image_url, 
        quantity: 1
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    
    alert("ITEM_ADDED_TO_MANIFEST");
    navigate('/cart');
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center font-black italic animate-pulse">DECRYPTING_PRODUCT_CORE...</div>;
  if (!product) return <div className="min-h-screen bg-white flex items-center justify-center font-black text-red-600">NULL_REFERENCE_ERROR</div>;

  const finalPrice = product.discount > 0 
    ? product.price - (product.price * (product.discount / 100)) 
    : product.price;

  const displayCategory = typeof product.category === 'object' ? product.category?.name : product.category;

  return (
    <div className="min-h-screen bg-white text-black p-2 md:p-6 mt-4 uppercase font-bold">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* TOP NAVIGATION */}
        <div className="flex items-center gap-5 border-b-4 border-black pb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="p-4 border-2 border-black hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_#000] active:shadow-none"
          >
            <ArrowBackIcon />
          </button>
          <div>
            <p className="text-[10px] font-black tracking-[0.4em] text-zinc-400 italic mb-1 uppercase">
              Archive_Ref // {displayCategory || "UNCACHED"}
            </p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase leading-none">{product.name}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT: VISUAL GALLERY */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative group border-4 border-black bg-white aspect-4/5 overflow-hidden shadow-[12px_12px_0px_#000]">
              <img 
                src={Array.isArray(product.images) ? product.images[activeImgIndex] : (product.image_url || '/placeholder.png')} 
                alt="Main" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
              />
              
              {product.images?.length > 1 && (
                <>
                  <button 
                    onClick={() => setActiveImgIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1)} 
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white border-2 border-black p-2 hover:bg-[#f97316] hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-[4px_4px_0px_#000]"
                  >
                    <ChevronLeftIcon />
                  </button>
                  <button 
                    onClick={() => setActiveImgIndex(prev => prev === product.images.length - 1 ? 0 : prev + 1)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white border-2 border-black p-2 hover:bg-[#f97316] hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-[4px_4px_0px_#000]"
                  >
                    <ChevronRightIcon />
                  </button>
                </>
              )}
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {Array.isArray(product.images) && product.images.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setActiveImgIndex(i)}
                  className={`min-w-100px h-120px border-2 cursor-pointer transition-all ${
                    activeImgIndex === i ? 'border-[#f97316] shadow-[4px_4px_0px_#000]' : 'border-black grayscale opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: INTERACTION & INFO */}
          <div className="lg:col-span-6 space-y-8">
            <div className="bg-black text-white p-8 border-2 border-black shadow-[8px_8px_0px_#f97316]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 text-[#f97316]">
                  <PaymentsIcon sx={{ fontSize: 18 }} />
                  <span className="text-[10px] font-black tracking-widest uppercase italic">MARKET_VALUATION</span>
                </div>
                {product.discount > 0 && (
                  <span className="bg-red-600 text-white px-2 py-0.5 text-[9px] font-black italic">-{product.discount}% OFF</span>
                )}
              </div>
              <div className="flex flex-col">
                {product.discount > 0 && (
                  <span className="text-zinc-500 line-through text-lg font-bold">RP {product.price?.toLocaleString('id-ID')}</span>
                )}
                <h3 className="text-6xl font-black tracking-tighter italic leading-none">RP {finalPrice?.toLocaleString('id-ID')}</h3>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <p className="text-xs font-black italic tracking-widest">SELECT_SIZE_VARIANT</p>
                {selectedSize && (
                  <p className="text-[10px] text-[#f97316]">
                    STOCK_AVAILABILITY: {product.sizes?.[selectedSize] || product[selectedSize.toLowerCase()] || 0} PCS
                  </p>
                )}
              </div>
              <div className="grid grid-cols-5 gap-3">
                {['S', 'M', 'L', 'XL', 'XXL'].map((size) => {
                  const stock = product.sizes?.[size] || product[size.toLowerCase()] || 0;
                  const isAvailable = stock > 0;
                  return (
                    <button
                      key={size}
                      disabled={!isAvailable}
                      onClick={() => setSelectedSize(size)}
                      className={`py-4 border-2 font-black transition-all ${
                        !isAvailable ? 'border-zinc-100 text-zinc-200 cursor-not-allowed bg-zinc-50' :
                        selectedSize === size ? 'bg-black text-white border-black shadow-[4px_4px_0px_#f97316]' : 'border-black hover:bg-zinc-50'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-zinc-100 border-2 border-black p-4 flex items-center justify-between shadow-[4px_4px_0px_#000]">
                <div className="flex items-center gap-3">
                    <LabelIcon sx={{ fontSize: 16 }} />
                    <p className="text-[10px] font-black italic tracking-widest uppercase">Archive_Series_Reference</p>
                </div>
                <p className="text-xs font-black uppercase tracking-tighter italic">
                    {product.issues ? (typeof product.issues === 'object' ? product.issues.name : product.issues) : "N/A"}
                </p>
            </div>

            <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_#000] relative">
              <div className="absolute -top-3 left-6 bg-black text-white px-4 py-1 border-2 border-black font-black text-[10px] uppercase italic tracking-widest">
                Product_Manifesto
              </div>
              <p className="text-xs font-bold leading-relaxed text-zinc-600 uppercase italic mt-2 whitespace-pre-wrap">
                {product.description || "NO_DESCRIPTION_AVAILABLE_IN_DATABASE."}
              </p>
            </div>

            <button 
              onClick={handleAddToCart}
              className="w-full bg-[#f97316] text-black py-6 flex items-center justify-center gap-4 border-4 border-black hover:bg-black hover:text-white transition-all shadow-[10px_10px_0px_#000] active:shadow-none"
            >
              <ShoppingBagIcon />
              <span className="text-xl font-black italic tracking-widest uppercase">INITIALIZE_ADD_TO_CART</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailUser;