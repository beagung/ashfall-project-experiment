import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Icons (MUI)
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const ManageProducts = () => {
  const navigate = useNavigate();

  // State untuk data produk, kategori, dan pengaturan tampilan
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL_CATEGORIES");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // 1. Fetch Data: Mengambil daftar produk dan kategori dari API
  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([axios.get("http://localhost:5000/api/products"), axios.get("http://localhost:5000/api/categories")]);
      setProducts(prodRes.data);
    } catch (err) {
      console.error("FETCH_ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Logic Filtering: Menyaring produk berdasarkan pencarian dan kategori
  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const itemCategoryName = item.categories?.name || "";
    const matchesCategory = selectedCategory === "ALL_CATEGORIES" || itemCategoryName.toUpperCase() === selectedCategory.toUpperCase();
    return matchesSearch && matchesCategory;
  });

  // 3. Logic Pagination: Menentukan data untuk halaman aktif
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // 4. Handle Delete: Menghapus produk berdasarkan ID dengan konfirmasi
  const handleDelete = async (id_product, name) => {
    if (window.confirm(`Yakin ingin menghapus produk: ${name}?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id_product}`);
        fetchData(); // Refresh data setelah penghapusan
      } catch (err) {
        alert("Gagal menghapus produk.");
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header & Add Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-4xl font-black italic uppercase">PRODUCT_MANAGEMENT</h2>
          <button onClick={() => navigate("/admin/add-new-products")} className="bg-black text-white px-6 py-4 flex items-center gap-3 hover:bg-[#f97316] transition-all">
            <AddIcon />
            <span className="font-black text-xs uppercase">ADD_NEW_PRODUCT</span>
          </button>
        </div>

        {/* Tabel Data Produk */}
        <div className="bg-white border-2 border-black shadow-[8px_8px_0px_#000]">
          <table className="w-full text-left border-collapse">
            {/* Tabel Head & Body (Tetap seperti kode Anda) */}
            <tbody>
              {currentProducts.map((item) => (
                <tr key={item.id_product} className="border-b-2 border-zinc-100">
                  {/* Kolom-kolom Produk */}
                  <td className="p-4">{item.name}</td>
                  <td className="p-4 uppercase">{item.categories?.name || "N/A"}</td>
                  <td className="p-4">RP {item.price?.toLocaleString("id-ID")}</td>
                  <td className="p-4 text-center">{item.stock}</td>
                  <td className="p-4 flex gap-2 justify-center">
                    <button onClick={() => navigate(`/admin/edit-products/${item.id_product}`)} className="p-2 border-2 border-black">
                      <EditIcon sx={{ fontSize: 18 }} />
                    </button>
                    <button onClick={() => handleDelete(item.id_product, item.name)} className="p-2 border-2 border-black text-red-600">
                      <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageProducts;
