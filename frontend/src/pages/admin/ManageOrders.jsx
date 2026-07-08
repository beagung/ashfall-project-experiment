import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../../components/admin/AdminLayout";

// Icons
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RefreshIcon from "@mui/icons-material/Refresh";

const ManageOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000/api/orders";

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/admin/all`);
      setOrders(res.data);
    } catch (err) {
      console.error("FETCH_ERROR:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateStatus = async (e, id_order, newStatus) => {
    e.stopPropagation();
    try {
      await axios.put(`${API_URL}/admin/update/${id_order}`, { status: newStatus });
      fetchData();
    } catch (err) {
      console.error("UPDATE_ERROR:", err.response?.data || err.message);
      alert("Gagal mengupdate status.");
    }
  };

  const handleDelete = async (e, id_order, orderIdDisplay) => {
    e.stopPropagation();
    if (window.confirm(`Yakin ingin menghapus order: ${orderIdDisplay}?`)) {
      try {
        await axios.delete(`${API_URL}/admin/delete/${id_order}`);
        fetchData();
      } catch (err) {
        console.error("DELETE_ERROR:", err.response?.data || err.message);
        alert("Gagal menghapus order.");
      }
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "settlement":
      case "paid":
        return "bg-blue-500 text-white border-black";
      case "shipping":
        return "bg-green-500 text-white border-black";
      case "pending":
        return "bg-yellow-400 text-black border-black";
      case "cancel":
        return "bg-red-500 text-white border-black";
      default:
        return "bg-zinc-200 text-black border-black";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-500 uppercase">
        <div className="flex justify-between items-center">
          <h2 className="text-4xl font-black italic">ORDER_MANAGEMENT</h2>
          <button onClick={fetchData} className="bg-black text-white px-6 py-4 flex gap-3 border-2 border-black hover:bg-[#f97316] transition-all">
            <RefreshIcon className={loading ? "animate-spin" : ""} />
            <span className="font-black text-xs tracking-widest">REFRESH</span>
          </button>
        </div>

        <div className="bg-white border-2 border-black shadow-[8px_8px_0px_#000] overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black text-white text-[10px] tracking-[.3em] font-black">
                <th className="p-5">ORDER_ID</th>
                <th className="p-5">CUSTOMER</th>
                <th className="p-5">CONTACT</th>
                <th className="p-5">SHIPPING_ADDRESS</th>
                <th className="p-5 text-center">STATUS_CONTROL</th>
                <th className="p-5 text-center">OP</th>
              </tr>
            </thead>
            <tbody className="text-[11px] font-bold">
              {orders.map((item) => (
                <tr key={item.id_order} onClick={() => navigate(`/admin/detail-orders/${item.id_order}`)} className="border-b-2 border-zinc-100 hover:bg-zinc-50 cursor-pointer">
                  <td className="p-5 font-mono">#{item.order_id?.split("-")[1] || item.order_id}</td>
                  <td className="p-5">{item.customer_name}</td>
                  <td className="p-5">{item.phone || "-"}</td>
                  <td className="p-5 max-w-[200px]">
                    <p className="truncate">{item.address}</p>
                    <p className="text-[9px] text-zinc-500">
                      {item.city}, {item.district}, {item.province}
                    </p>
                  </td>
                  <td className="p-5 text-center" onClick={(e) => e.stopPropagation()}>
                    <select value={item.status} onChange={(e) => handleUpdateStatus(e, item.id_order, e.target.value)} className={`p-2 border-2 font-black text-[9px] cursor-pointer ${getStatusStyle(item.status)}`}>
                      <option value="pending">WAITING_PAYMENT</option>
                      <option value="paid">PAYMENT_RECEIVED</option>
                      <option value="settlement">ORDER_VERIFIED</option>
                      <option value="shipping">ON_THE_WAY</option>
                      <option value="cancel">ORDER_CANCELLED</option>
                    </select>
                  </td>
                  <td className="p-5 text-center">
                    <button onClick={(e) => handleDelete(e, item.id_order, item.order_id)} className="p-2 border-2 border-black bg-white hover:bg-red-600 hover:text-white transition-all">
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

export default ManageOrders;
