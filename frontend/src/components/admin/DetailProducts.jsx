import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import axios from 'axios';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import PaymentsIcon from '@mui/icons-material/Payments';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LabelIcon from '@mui/icons-material/Label'; 

const DetailProducts = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error("FETCH_ERROR:", err);
        alert("ACCESS_DENIED: DATA_NOT_FOUND");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProductDetail();
  }, [id]);

  const nextImg = () => {
    if (product?.images?.length) {
      setActiveImgIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    }
  };

  const prevImg = () => {
    if (product?.images?.length) {
      setActiveImgIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    }
  };

  if (loading) return <AdminLayout><div className="font-black p-10 italic animate-pulse">DECRYPTING_PRODUCT_CORE...</div></AdminLayout>;
  if (!product) return <AdminLayout><div className="font-black p-10 text-red-600">NULL_REFERENCE_ERROR</div></AdminLayout>;

  // Kalkulasi Harga Akhir
  const finalPrice = product.discount > 0 
    ? product.price - (product.price * (product.discount / 100)) 
    : product.price;

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-4 border-black pb-8">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => navigate('/admin/manage-products')}
              className="p-4 border-2 border-black hover:bg-[#f97316] hover:text-white transition-all shadow-[4px_4px_0px_#000] active:shadow-none"
            >
              <ArrowBackIcon />
            </button>
            <div>
              <p className="text-[10px] font-black tracking-[0.4em] text-zinc-400 uppercase italic leading-none mb-2">System_Ref // {id}</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase leading-none">{product.name}</h2>
            </div>
          </div>

          <button 
            onClick={() => navigate(`/admin/edit-products/${id}`)}
            className="bg-[#f97316] text-white px-8 py-4 flex items-center justify-center gap-3 border-2 border-black hover:bg-black hover:shadow-[6px_6px_0px_#f97316] transition-all group"
          >
            <EditIcon sx={{ fontSize: 20 }} />
            <span className="font-black text-xs tracking-widest uppercase">OVERWRITE_RECORD</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT: VISUAL GALLERY */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative group border-4 border-black bg-white aspect-square overflow-hidden shadow-[12px_12px_0px_#000]">
              <img 
                src={product.images?.[activeImgIndex] || 'https://via.placeholder.com/600'} 
                alt="Main" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
              />
              
              {product.images?.length > 1 && (
                <>
                  <button onClick={prevImg} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white border-2 border-black p-2 hover:bg-[#f97316] hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-[4px_4px_0px_#000]"><ChevronLeftIcon /></button>
                  <button onClick={nextImg} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white border-2 border-black p-2 hover:bg-[#f97316] hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-[4px_4px_0px_#000]"><ChevronRightIcon /></button>
                </                >
              )}
              
              <div className="absolute bottom-4 right-4 bg-black text-white px-3 py-1 font-black text-[10px] italic">
                IMG_{activeImgIndex + 1} / {product.images?.length || 0}
              </div>
            </div>

            {/* THUMBNAILS */}
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {product.images?.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setActiveImgIndex(i)}
                  className={`min-w-80px h-80px border-2 cursor-pointer transition-all ${
                    activeImgIndex === i ? 'border-[#f97316] shadow-[4px_4px_0px_#000]' : 'border-black grayscale opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: SPECS & STOCK */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* PRICING BLOCK */}
            <div className="bg-black text-white p-8 border-2 border-black shadow-[8px_8px_0px_#f97316]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 text-[#f97316]">
                  <PaymentsIcon sx={{ fontSize: 18 }} />
                  <span className="text-[10px] font-black tracking-widest uppercase italic">MARKET_VALUATION</span>
                </div>
                {product.discount > 0 && (
                  <span className="bg-red-600 text-white px-2 py-0.5 text-[9px] font-black italic animate-pulse">
                    ACTIVE_CAMPAIGN: -{product.discount}%
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                {product.discount > 0 && (
                  <span className="text-zinc-500 line-through text-lg font-bold">
                    RP {Number(product.price).toLocaleString('id-ID')}
                  </span>
                )}
                <h3 className="text-5xl md:text-6xl font-black tracking-tighter italic leading-none">
                  RP {finalPrice.toLocaleString('id-ID')}
                </h3>
              </div>
            </div>

            {/* STOCK DISTRIBUTION */}
            <div className="bg-white border-4 border-black shadow-[10px_10px_0px_#000]">
              <div className="bg-black text-white px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <InventoryIcon sx={{ fontSize: 18, color: '#f97316' }} />
                  <h4 className="text-[11px] font-black tracking-[0.2em] uppercase italic">STOCK_DISTRIBUTION</h4>
                </div>
                <span className="text-[10px] font-black bg-zinc-800 px-3 py-1 italic tracking-widest border border-zinc-700">
                  TOTAL: {product.stock} PCS
                </span>
              </div>
              
              <div className="grid grid-cols-5 divide-x-2 divide-black border-b-2 border-black">
                {['S', 'M', 'L', 'XL', 'XXL'].map((size) => {
                  const sizeQty = product.sizes ? (product.sizes[size] || 0) : 0;
                  return (
                    <div key={size} className={`p-4 text-center transition-colors ${sizeQty > 0 ? 'bg-white' : 'bg-zinc-100 opacity-50'}`}>
                      <p className="text-[10px] font-black text-zinc-400 mb-1">{size}</p>
                      <p className={`text-2xl font-black italic ${sizeQty > 0 ? 'text-black' : 'text-zinc-300'}`}>
                        {sizeQty}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* CLASSIFICATION & ISSUE REFERENCE */}
              <div className="flex flex-col">
                <div className="p-4 bg-zinc-50 flex items-center gap-4 border-b-2 border-black">
                  <CategoryIcon sx={{ fontSize: 16, color: '#f97316' }} />
                  <div>
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Classification</p>
                    {/* PERUBAHAN DISINI: Mengakses .name dari object relasi category */}
                    <p className="text-xs font-black uppercase italic tracking-tighter">
                      {product.category?.name || 'UNASSIGNED'}
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-zinc-50 flex items-center gap-4">
                  <LabelIcon sx={{ fontSize: 16, color: '#f97316' }} />
                  <div>
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Issue_Reference</p>
                    <p className="text-xs font-black uppercase italic tracking-tighter">
                      {product.issues ? product.issues.name : 'NO_ISSUE_ASSIGNED'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* DESCRIPTION BOX */}
            <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_#000] relative">
              <div className="absolute -top-3 left-6 bg-black text-white px-4 py-1 border-2 border-black font-black text-[10px] uppercase italic tracking-widest">
                Product_Manifesto
              </div>
              <p className="text-xs font-bold leading-relaxed text-zinc-600 uppercase mt-2 whitespace-pre-wrap">
                {product.description || "NO_DESCRIPTION_AVAILABLE_IN_DATABASE."}
              </p>
            </div>

          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DetailProducts;