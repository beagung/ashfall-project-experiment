import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../../components/admin/AdminLayout";

// Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

const AddNewProduct = () => {
  const navigate = useNavigate();

  // State UI
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [issuesList, setIssuesList] = useState([]);

  // State Form Data
  const [productData, setProductData] = useState({
    name: "",
    category_id: "",
    issue_id: "",
    price: "",
    stock: 0,
    description: "",
    discount: 0,
  });

  // State Stok Per Ukuran
  const [sizeStocks, setSizeStocks] = useState({
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    XXL: 0,
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  // 1. Load Data (Categories & Issues)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, issueRes] = await Promise.all([axios.get("http://localhost:5000/api/categories"), axios.get("http://localhost:5000/api/issues")]);

        setCategories(catRes.data);
        setIssuesList(issueRes.data);

        // SINKRONISASI: Set default menggunakan id_category dari data pertama jika tersedia
        if (catRes.data.length > 0) {
          setProductData((prev) => ({ ...prev, category_id: catRes.data[0].id_category }));
        }
      } catch (err) {
        console.error("FAILED_TO_LOAD_DATA:", err);
      }
    };
    fetchData();
  }, []);

  // 2. Auto Calculate Total Stock
  useEffect(() => {
    const total = Object.values(sizeStocks).reduce((acc, curr) => acc + (parseInt(curr) || 0), 0);
    setProductData((prev) => ({ ...prev, stock: total }));
  }, [sizeStocks]);

  // 3. Handle Image Logic
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || e.dataTransfer.files);
    if (imageFiles.length + files.length > 5) {
      alert("MAX_LIMIT_REACHED: 5 IMAGES ONLY");
      return;
    }
    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    setImageFiles((prev) => [...prev, ...validFiles]);
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // 4. Handle Stock Per Size Change
  const handleSizeStockChange = (size, value) => {
    const val = value === "" ? 0 : parseInt(value);
    setSizeStocks((prev) => ({ ...prev, [size]: val }));
  };

  // 5. Submit to Backend
  const handlePublish = async () => {
    if (!productData.name || !productData.price || !productData.category_id || imageFiles.length === 0) {
      alert("REQUIRED_FIELDS: NAME, CATEGORY, PRICE, AND AT LEAST 1 IMAGE");
      return;
    }

    setLoading(true);
    const formData = new FormData();

    formData.append("name", productData.name.toUpperCase());
    formData.append("category_id", productData.category_id);
    formData.append("issue_id", productData.issue_id);
    formData.append("price", productData.price);
    formData.append("stock", productData.stock);
    formData.append("description", productData.description);
    formData.append("discount", productData.discount);
    formData.append("sizes", JSON.stringify(sizeStocks));

    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await axios.post("http://localhost:5000/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        alert("ITEM_PUBLISHED_SUCCESSFULLY");
        navigate("/admin/manage-products");
      }
    } catch (error) {
      alert(error.response?.data?.details || error.response?.data?.error || "TRANSACTION_FAILED");
    } finally {
      setLoading(false);
    }
  };

  const calculateFinalPrice = () => {
    const price = parseFloat(productData.price) || 0;
    const discount = parseFloat(productData.discount) || 0;
    return price - price * (discount / 100);
  };

  return (
    <AdminLayout>
      <div className={`w-full space-y-6 animate-in fade-in duration-700 ${loading ? "opacity-50 pointer-events-none" : ""}`}>
        {/* HEADER */}
        <div className="flex items-center justify-between border-b-4 border-black pb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/admin/manage-products")} className="p-3 border-2 border-black hover:bg-[#f97316] transition-all shadow-[4px_4px_0px_#000]">
              <ArrowBackIcon />
            </button>
            <div>
              <h2 className="text-4xl font-black tracking-tighter italic uppercase leading-none">ADD_NEW_ITEM</h2>
              <p className="text-[10px] tracking-[0.3em] text-zinc-500 font-bold uppercase italic mt-1">{loading ? "STATUS: UPLOADING_TO_CLOUD..." : "STATUS: DRAFT_MODE // STORAGE: CLOUD_READY"}</p>
            </div>
          </div>

          <button
            onClick={handlePublish}
            disabled={loading}
            className="hidden md:flex bg-[#f97316] text-white px-8 py-4 border-2 border-black items-center gap-3 hover:bg-black hover:shadow-[6px_6px_0px_#f97316] transition-all disabled:bg-zinc-400"
          >
            <SaveIcon />
            <span className="font-black tracking-widest uppercase text-xs">{loading ? "PROCESSING..." : "PUBLISH_NOW"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: VISUALS & DESCRIPTION */}
          <div className="space-y-6">
            <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_#000]">
              <label className="text-[11px] font-black tracking-widest uppercase mb-4 block underline decoration-2 decoration-[#f97316]">Product_Visuals (Max 5)</label>

              <div
                className={`border-4 border-dashed p-8 flex flex-col items-center justify-center transition-all ${dragActive ? "bg-zinc-100 border-[#f97316]" : "bg-zinc-50 border-zinc-200"}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  handleImageUpload(e);
                  setDragActive(false);
                }}
              >
                <AddPhotoAlternateIcon sx={{ fontSize: 40, mb: 1, opacity: 0.2 }} />
                <input type="file" multiple onChange={handleImageUpload} className="hidden" id="img-input" accept="image/*" />
                <label htmlFor="img-input" className="cursor-pointer bg-black text-white px-6 py-2 font-black text-[10px] hover:bg-[#f97316] transition-colors uppercase">
                  Select_Files
                </label>
              </div>

              <div className="grid grid-cols-5 gap-2 mt-4">
                {previews.map((src, index) => (
                  <div key={index} className="relative aspect-square border-2 border-black group">
                    <img src={src} alt="preview" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                    <button onClick={() => removeImage(index)} className="absolute top-0 right-0 bg-red-600 text-white p-1 hover:bg-black transition-colors">
                      <DeleteIcon sx={{ fontSize: 14 }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_#000]">
              <label className="text-[11px] font-black tracking-widest uppercase mb-4 block underline decoration-2 decoration-[#f97316]">Product_Description</label>
              <textarea
                rows="6"
                className="w-full p-4 bg-zinc-50 border-2 border-transparent focus:border-black outline-none font-bold text-xs uppercase resize-none"
                placeholder="DETAILS, MATERIAL, CARE..."
                value={productData.description}
                onChange={(e) => setProductData({ ...productData, description: e.target.value })}
              ></textarea>
            </div>
          </div>

          {/* RIGHT: SPECS, PRICING & STOCK */}
          <div className="space-y-6">
            <div className="bg-black text-white border-2 border-white p-8 shadow-[10px_10px_0px_#f97316] space-y-8">
              {/* INPUT FIELDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] text-zinc-500 font-black uppercase">Identity_Name</label>
                  <input
                    type="text"
                    className="w-full bg-zinc-900 border-b-2 border-zinc-700 focus:border-[#f97316] outline-none py-2 font-black text-sm uppercase"
                    placeholder="ITEM NAME..."
                    value={productData.name}
                    onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                  />
                </div>

                {/* DROPDOWN KATEGORI */}
                <div className="space-y-2">
                  <label className="text-[9px] text-zinc-500 font-black uppercase">Classification</label>
                  <select
                    className="w-full bg-zinc-900 border-b-2 border-zinc-700 focus:border-[#f97316] outline-none py-2 font-black text-sm uppercase cursor-pointer"
                    value={productData.category_id}
                    onChange={(e) => setProductData({ ...productData, category_id: e.target.value })}
                  >
                    <option value="" disabled>
                      -- SELECT_CATEGORY --
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id_category} value={cat.id_category}>
                        {cat.name.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* DROPDOWN ISSUES */}
              <div className="space-y-2">
                <label className="text-[9px] text-zinc-500 font-black uppercase">Issue_Reference</label>
                <select
                  className="w-full bg-zinc-900 border-b-2 border-zinc-700 focus:border-[#f97316] outline-none py-2 font-black text-sm uppercase cursor-pointer"
                  value={productData.issue_id}
                  onChange={(e) => setProductData({ ...productData, issue_id: e.target.value })}
                >
                  <option value="">-- NO_ISSUE --</option>
                  {issuesList.map((item) => (
                    <option key={item.id_issue} value={item.id_issue}>
                      {item.name.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* PRICING & DISCOUNT */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] text-zinc-500 font-black uppercase">Valuation (IDR)</label>
                    <input
                      type="number"
                      className="w-full bg-zinc-900 border-b-2 border-zinc-700 focus:border-[#f97316] outline-none py-2 font-black text-2xl"
                      placeholder="0"
                      value={productData.price}
                      onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] text-[#f97316] font-black uppercase">Campaign_Discount (%)</label>
                    <input
                      type="number"
                      className="w-full bg-zinc-900 border-b-2 border-zinc-700 focus:border-[#f97316] outline-none py-2 font-black text-2xl"
                      value={productData.discount}
                      onChange={(e) => setProductData({ ...productData, discount: Math.min(100, Math.max(0, e.target.value)) })}
                    />
                  </div>
                </div>

                {/* LIVE CALCULATION */}
                {productData.price > 0 && (
                  <div className="bg-zinc-900 border-l-4 border-[#f97316] p-4 flex justify-between items-center">
                    <div>
                      <p className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">Net_Final_Price</p>
                      <p className="text-xl font-black italic text-white uppercase">RP {calculateFinalPrice().toLocaleString("id-ID")}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* STOCK DISTRIBUTION */}
              <div className="space-y-4">
                <label className="text-[9px] text-[#f97316] font-black uppercase block underline decoration-zinc-800 underline-offset-4">Stock_Distribution_Per_Size</label>
                <div className="grid grid-cols-5 gap-3">
                  {["S", "M", "L", "XL", "XXL"].map((size) => (
                    <div key={size} className="flex flex-col gap-2">
                      <div className={`py-1 text-center font-black text-[11px] border-2 border-black transition-colors ${sizeStocks[size] > 0 ? "bg-[#f97316] text-white" : "bg-zinc-800 text-zinc-500"}`}>{size}</div>
                      <input
                        type="number"
                        className="w-full bg-zinc-900 border-2 border-zinc-800 focus:border-white outline-none py-2 text-center font-black text-xs"
                        value={sizeStocks[size]}
                        onChange={(e) => handleSizeStockChange(size, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center bg-zinc-900 p-3 border border-zinc-800 mt-2">
                  <span className="text-[9px] font-black text-zinc-500 uppercase">Total_Calculated_Inventory:</span>
                  <span className="text-sm font-black text-[#f97316] italic">{productData.stock} PCS</span>
                </div>
              </div>

              <button onClick={handlePublish} disabled={loading} className="w-full bg-[#f97316] text-white py-5 border-2 border-black flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all md:hidden">
                <SaveIcon />
                <span className="font-black uppercase tracking-[0.3em]">{loading ? "UPLOADING..." : "Publish_Now"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddNewProduct;
