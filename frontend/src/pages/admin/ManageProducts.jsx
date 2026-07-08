import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Icons
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FilterListIcon from "@mui/icons-material/FilterList";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const ManageProducts = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL_CATEGORIES");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([axios.get("http://localhost:5000/api/products"), axios.get("http://localhost:5000/api/categories")]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error("FETCH_ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const itemCategoryName = item.category?.name || "";
    const matchesCategory = selectedCategory === "ALL_CATEGORIES" || itemCategoryName.toUpperCase() === selectedCategory.toUpperCase();
    return matchesSearch && matchesCategory;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // 🟢 LOGIKA HAPUS DENGAN id_product
  const handleDelete = async (id_product, name) => {
    if (window.confirm(`Yakin ingin menghapus produk: ${name}?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id_product}`);
        fetchData();
      } catch (err) {
        console.error("DELETE_ERROR:", err);
        alert("Gagal menghapus produk. Cek konsol.");
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-4xl font-black tracking-tighter italic leading-none uppercase">PRODUCT_MANAGEMENT</h2>
            <p className="text-[10px] tracking-[0.3em] text-zinc-500 font-bold mt-1 uppercase">{loading ? "STATUS: FETCHING_DATA..." : `TOTAL PRODUCTS: ${products.length} // SYSTEM ACTIVE`}</p>
          </div>
          <button onClick={() => navigate("/admin/add-new-products")} className="bg-black text-white px-6 py-4 flex items-center justify-center gap-3 border-2 border-black hover:bg-[#f97316] hover:border-[#f97316] transition-all">
            <AddIcon />
            <span className="font-black text-xs tracking-widest uppercase">ADD_NEW_PRODUCT</span>
          </button>
        </div>

        <div className="bg-white border-2 border-black overflow-hidden shadow-[8px_8px_0px_#000]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black text-white text-[10px] tracking-[.3em] font-black uppercase">
                <th className="p-5 border-r border-zinc-800 text-center">IMG</th>
                <th className="p-5 border-r border-zinc-800">PRODUCT_NAME</th>
                <th className="p-5 border-r border-zinc-800">CATEGORY</th>
                <th className="p-5 border-r border-zinc-800">PRICE</th>
                <th className="p-5 border-r border-zinc-800">STOCK</th>
                <th className="p-5 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="text-[11px] font-bold">
              {currentProducts.map((item) => (
                <tr key={item.id_product} className="border-b-2 border-zinc-100 hover:bg-zinc-50 transition-colors">
                  <td className="p-4 border-r-2 border-zinc-100 text-center">
                    <img src={item.images?.[0] || "https://via.placeholder.com/50"} alt="prod" className="w-12 h-12 object-cover" />
                  </td>
                  <td className="p-4 border-r-2 border-zinc-100 cursor-pointer hover:text-[#f97316]" onClick={() => navigate(`/admin/detail-products/${item.id_product}`)}>
                    {item.name}
                  </td>
                  <td className="p-4 border-r-2 border-zinc-100 uppercase">{item.categories?.name || "N/A"}</td>
                  <td className="p-4 border-r-2 border-zinc-100">RP {item.price?.toLocaleString("id-ID")}</td>
                  <td className="p-4 border-r-2 border-zinc-100 text-center">{item.stock}</td>
                  <td className="p-4">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/edit-products/${item.id_product}`);
                        }}
                        className="p-2 border-2 border-black hover:bg-black hover:text-white"
                      >
                        <EditIcon sx={{ fontSize: 18 }} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id_product, item.name);
                        }}
                        className="p-2 border-2 border-black hover:bg-red-600 hover:text-white"
                      >
                        <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                      </button>
                    </div>
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
