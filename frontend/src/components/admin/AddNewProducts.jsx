import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../../components/admin/AdminLayout";

// Icons (MUI)
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

const AddNewProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [issuesList, setIssuesList] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  // State Form Data Utama
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
  const [sizeStocks, setSizeStocks] = useState({ S: 0, M: 0, L: 0, XL: 0, XXL: 0 });

  // 1. Load Data Referensi (Kategori & Issues) dari Backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, issueRes] = await Promise.all([axios.get("http://localhost:5000/api/categories"), axios.get("http://localhost:5000/api/issues")]);
        setCategories(catRes.data);
        setIssuesList(issueRes.data);
      } catch (err) {
        console.error("FAILED_TO_LOAD_DATA:", err);
      }
    };
    fetchData();
  }, []);

  // 2. Auto-Calculation: Update total stok setiap ada perubahan ukuran
  useEffect(() => {
    const total = Object.values(sizeStocks).reduce((acc, curr) => acc + (parseInt(curr) || 0), 0);
    setProductData((prev) => ({ ...prev, stock: total }));
  }, [sizeStocks]);

  // 3. Handle Submit: Mengirim data ke API menggunakan FormData (mendukung file upload)
  const handlePublish = async () => {
    if (!productData.name || imageFiles.length === 0) {
      return alert("REQUIRED_FIELDS: NAME AND AT LEAST 1 IMAGE");
    }

    setLoading(true);
    const formData = new FormData();

    // Mapping data form ke FormData
    Object.keys(productData).forEach((key) => formData.append(key, productData[key]));
    formData.append("sizes", JSON.stringify(sizeStocks));
    imageFiles.forEach((file) => formData.append("images", file));

    try {
      await axios.post("http://localhost:5000/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("ITEM_PUBLISHED_SUCCESSFULLY");
      navigate("/admin/manage-products");
    } catch (error) {
      alert("TRANSACTION_FAILED");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      {/* Struktur UI Add New Product */}
      <div className={`w-full space-y-6 ${loading ? "opacity-50" : ""}`}>
        {/* Header & Submit Button */}
        <div className="flex justify-between items-center border-b-4 border-black pb-6">
          <h2 className="text-4xl font-black italic uppercase">ADD_NEW_ITEM</h2>
          <button onClick={handlePublish} disabled={loading} className="bg-[#f97316] text-white px-8 py-4 font-black uppercase">
            {loading ? "PROCESSING..." : "PUBLISH_NOW"}
          </button>
        </div>

        {/* Konten Form ... (Bagian return JSX Anda tetap di sini) */}
      </div>
    </AdminLayout>
  );
};

export default AddNewProduct;
