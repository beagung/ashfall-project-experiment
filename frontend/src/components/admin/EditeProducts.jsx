import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import axios from 'axios';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

const EditProducts = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // State Form Data (Menggunakan category_id sesuai kebutuhan database/backend)
  const [formData, setFormData] = useState({
    name: '',
    category_id: '', 
    issue_id: '', 
    price: '',
    stock: 0,
    description: '',
    discount: 0
  });

  // State Stok Per Ukuran
  const [sizeStocks, setSizeStocks] = useState({
    S: 0, M: 0, L: 0, XL: 0, XXL: 0
  });
  
  const [categories, setCategories] = useState([]);
  const [issuesList, setIssuesList] = useState([]); 
  const [images, setImages] = useState([]); 
  const [imageFiles, setImageFiles] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);

  // 1. Fetch Initial Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes, issueRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/products/${id}`),
          axios.get('http://localhost:5000/api/categories'),
          axios.get('http://localhost:5000/api/issues')
        ]);

        const p = prodRes.data;
        
        // Ambil ID kategori dari data produk yang di-load
        const currentCategoryId = p.category_id || p.category?.id_category || p.category?.id || '';

        setFormData({
          name: p.name,
          category_id: currentCategoryId, // Simpan ID kategorinya, bukan nama string-nya
          issue_id: p.issue_id || '', 
          price: p.price,
          stock: p.stock,
          description: p.description,
          discount: p.discount || 0
        });

        if (p.sizes) {
          setSizeStocks(prev => ({
            ...prev,
            ...p.sizes 
          }));
        }

        setImages(p.images || []);
        
        // Normalisasi data kategori dari response API
        const rawCategories = Array.isArray(catRes.data) ? catRes.data : (catRes.data.data || []);
        setCategories(rawCategories);
        
        const rawIssues = Array.isArray(issueRes.data) ? issueRes.data : (issueRes.data.data || []);
        setIssuesList(rawIssues); 
      } catch (err) {
        console.error("FETCH_ERROR:", err);
        alert("FAILED_TO_SYNC_WITH_DATABASE");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // 2. Auto Calculate Total Stock
  useEffect(() => {
    const total = Object.values(sizeStocks).reduce((acc, curr) => acc + (parseInt(curr) || 0), 0);
    setFormData(prev => ({ ...prev, stock: total }));
  }, [sizeStocks]);

  const calculateFinalPrice = () => {
    const price = parseFloat(formData.price) || 0;
    const discount = parseFloat(formData.discount) || 0;
    return price - (price * (discount / 100));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'discount') {
        const val = Math.min(100, Math.max(0, value));
        setFormData(prev => ({ ...prev, [name]: val }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSizeStockChange = (size, value) => {
    const val = value === '' ? 0 : parseInt(value);
    setSizeStocks(prev => ({ ...prev, [size]: val }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || e.dataTransfer.files);
    if (images.length + files.length > 5) {
      alert("LIMIT_EXCEEDED: MAX 5 IMAGES");
      return;
    }
    setImageFiles(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    const imageToRemove = images[index];
    setImages(images.filter((_, i) => i !== index));
    
    if (!imageToRemove.startsWith('http')) {
      setImageFiles(prev => prev.filter((_, i) => i !== (index - images.filter(img => img.startsWith('http')).length)));
    }
  };

  // 3. Update Function
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name.toUpperCase());
      data.append('category_id', formData.category_id); // 🟢 FIX: Mengirimkan category_id berupa ID ke backend
      data.append('issue_id', formData.issue_id || ''); 
      data.append('price', formData.price);
      data.append('stock', formData.stock);
      data.append('description', formData.description);
      data.append('discount', formData.discount);
      data.append('sizes', JSON.stringify(sizeStocks));
      
      const existingImages = images.filter(img => img.startsWith('http'));
      data.append('existingImages', JSON.stringify(existingImages));

      imageFiles.forEach(file => data.append('images', file));

      await axios.put(`http://localhost:5000/api/products/${id}`, data);
      
      alert("DATABASE_SYNCHRONIZED_SUCCESSFULLY");
      navigate('/admin/manage-products');
    } catch (err) {
      console.error("UPDATE_ERROR:", err);
      alert(err.response?.data?.error || "TRANSACTION_FAILED");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <AdminLayout><div className="font-black p-10 italic animate-pulse">REWRITING_DATA_CORE...</div></AdminLayout>;

  return (
    <AdminLayout>
      <form onSubmit={handleUpdate} className="space-y-6 animate-in fade-in duration-500">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b-4 border-black pb-6">
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => navigate('/admin/manage-products')} className="p-3 border-2 border-black bg-white hover:bg-[#f97316] transition-all shadow-[4px_4px_0px_#000] active:translate-y-0.5 active:shadow-none">
              <ArrowBackIcon />
            </button>
            <div>
              <h2 className="text-4xl font-black tracking-tighter italic uppercase leading-none">EDIT_PRODUCT</h2>
              <p className="text-[10px] tracking-[0.3em] text-zinc-500 font-bold uppercase italic mt-1">REF_ID: {id}</p>
            </div>
          </div>
          
          <button type="submit" className="hidden md:flex bg-[#f97316] text-white px-8 py-4 border-2 border-black items-center gap-3 hover:bg-black hover:shadow-[6px_6px_0px_#f97316] transition-all">
            <SaveIcon />
            <span className="font-black tracking-widest uppercase text-xs">UPDATE_CHANGES</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* LEFT: VISUALS */}
          <div className="space-y-6">
            <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_#000]">
              <label className="text-[11px] font-black tracking-widest uppercase mb-4 block underline decoration-2 decoration-[#f97316]">Product_Visuals</label>
              <div 
                className={`border-4 border-dashed p-8 flex flex-col items-center justify-center transition-all ${dragActive ? 'bg-zinc-100 border-[#f97316]' : 'bg-zinc-50 border-zinc-200'}`}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => { e.preventDefault(); handleImageUpload(e); setDragActive(false); }}
              >
                <input type="file" multiple onChange={handleImageUpload} className="hidden" id="file-edit" accept="image/*" />
                <label htmlFor="file-edit" className="cursor-pointer bg-black text-white px-6 py-2 font-black text-[10px] uppercase hover:bg-[#f97316]">Upload_New_Media</label>
              </div>

              <div className="grid grid-cols-5 gap-2 mt-4">
                {images.map((src, index) => (
                  <div key={index} className="relative aspect-square border-2 border-black group">
                    <img src={src} alt="preview" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-0 right-0 bg-red-600 text-white p-1 hover:bg-black transition-colors"><DeleteIcon sx={{ fontSize: 14 }} /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_#000]">
              <label className="text-[11px] font-black tracking-widest uppercase mb-4 block underline decoration-2 decoration-[#f97316]">Manifesto_Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows="6" className="w-full p-4 bg-zinc-50 border-2 border-transparent focus:border-black outline-none font-bold text-xs uppercase resize-none" placeholder="REWRITE SPECIFICATIONS..." />
            </div>
          </div>

          {/* RIGHT: SPECS & STOCK */}
          <div className="space-y-6">
            <div className="bg-black text-white p-8 border-2 border-white shadow-[10px_10px_0px_#f97316] space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] text-zinc-500 font-black uppercase">Identity_Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-zinc-900 border-b-2 border-zinc-700 focus:border-[#f97316] outline-none py-2 font-black text-sm uppercase" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] text-zinc-500 font-black uppercase">Classification</label>
                  {/* 🟢 FIX: Menggunakan name="category_id" dan value={formData.category_id} */}
                  <select 
                    name="category_id" 
                    value={formData.category_id} 
                    onChange={handleInputChange} 
                    className="w-full bg-zinc-900 border-b-2 border-zinc-700 focus:border-[#f97316] outline-none py-2 font-black text-sm uppercase cursor-pointer"
                  >
                    <option value="">-- SELECT_CATEGORY --</option>
                    {categories.map(cat => {
                      const idCat = cat.id_category || cat.id;
                      return (
                        <option key={idCat} value={idCat}>{cat.name}</option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* DROPDOWN ISSUES */}
              <div className="space-y-2">
                <label className="text-[9px] text-zinc-500 font-black uppercase">Issue_Reference</label>
                <select 
                  name="issue_id"
                  className="w-full bg-zinc-900 border-b-2 border-zinc-700 focus:border-[#f97316] outline-none py-2 font-black text-sm uppercase cursor-pointer" 
                  value={formData.issue_id} 
                  onChange={handleInputChange}
                >
                  <option value="">-- NO_ISSUE --</option>
                  {issuesList.map(item => (
                    <option key={item.id_issue || item.id} value={item.id_issue || item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* PRICING & DISCOUNT */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] text-zinc-500 font-black uppercase">Valuation (IDR)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full bg-zinc-900 border-b-2 border-zinc-700 focus:border-[#f97316] outline-none py-2 font-black text-2xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] text-[#f97316] font-black uppercase">Campaign_Discount (%)</label>
                    <input type="number" name="discount" value={formData.discount} onChange={handleInputChange} className="w-full bg-zinc-900 border-b-2 border-zinc-700 focus:border-[#f97316] outline-none py-2 font-black text-2xl" />
                  </div>
                </div>

                {formData.price > 0 && (
                  <div className="bg-zinc-900 border-l-4 border-[#f97316] p-4 flex justify-between items-center">
                    <div>
                      <p className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">Net_Final_Price</p>
                      <p className="text-xl font-black italic text-white">
                        RP {calculateFinalPrice().toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* STOCK DISTRIBUTION */}
              <div className="space-y-4">
                <label className="text-[9px] text-[#f97316] font-black uppercase block underline decoration-zinc-800 underline-offset-4">Stock_Level_Distribution</label>
                <div className="grid grid-cols-5 gap-3">
                  {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <div key={size} className="flex flex-col gap-2">
                      <div className={`py-1 text-center font-black text-[11px] border-2 border-black transition-colors ${sizeStocks[size] > 0 ? 'bg-[#f97316]' : 'bg-zinc-800 text-zinc-500'}`}>
                        {size}
                      </div>
                      <input 
                        type="number"
                        min="0"
                        className="w-full bg-zinc-900 border-2 border-zinc-800 focus:border-white outline-none py-2 text-center font-black text-xs"
                        value={sizeStocks[size]}
                        onChange={(e) => handleSizeStockChange(size, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center bg-zinc-900 p-3 border border-zinc-800 mt-2">
                  <span className="text-[9px] font-black text-zinc-500 uppercase">Total_Calculated_Inventory:</span>
                  <span className="text-sm font-black text-[#f97316] italic">{formData.stock} PCS</span>
                </div>
              </div>

              <button type="submit" className="w-full bg-[#f97316] text-white py-5 border-2 border-black flex items-center justify-center gap-3 md:hidden uppercase font-black tracking-widest hover:bg-white hover:text-black transition-all">
                <SaveIcon />
                SAVE_CHANGES
              </button>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default EditProducts;