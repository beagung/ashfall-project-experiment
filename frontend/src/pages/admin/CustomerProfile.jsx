import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../../components/admin/AdminLayout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";

const CustomerProfile = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fungsi sinkronisasi warna status agar konsisten
  const getStatusDisplay = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return { label: "PENDING", style: "bg-yellow-400 text-black" };
      case "shipping":
        return { label: "SHIPPING", style: "bg-blue-500 text-white" };
      case "success":
      case "settlement":
        return { label: "SUCCESS", style: "bg-green-500 text-white" };
      case "failed":
      case "cancel":
        return { label: "CANCELLED", style: "bg-red-500 text-white" };
      default:
        return { label: status?.toUpperCase() || "UNKNOWN", style: "bg-zinc-200 text-black" };
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [ordersRes, profileRes] = await Promise.all([axios.get(`http://localhost:5000/api/orders/user-history/${email}`), axios.get(`http://localhost:5000/api/orders/customer-profile/${email}`)]);
        setOrders(ordersRes.data);
        setCustomer(profileRes.data);
      } catch (err) {
        console.error("CUSTOMER_DATA_FETCH_ERROR:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [email]);

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-500 uppercase">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-black hover:text-orange-500 transition-colors">
          <ArrowBackIcon /> BACK_TO_STATS
        </button>

        {/* PROFILE CARD */}
        {customer && (
          <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_#000]">
            <div className="flex items-center gap-6 mb-8 border-b-4 border-black pb-8">
              {/* Bagian Foto Profil */}
              <div className="w-20 h-20 border-2 border-black bg-zinc-100 flex items-center justify-center overflow-hidden shrink-0">
                {customer.avatar_url ? <img src={customer.avatar_url} alt="Profile" className="w-full h-full object-cover" /> : <PersonIcon style={{ fontSize: 40 }} />}
              </div>

              <div>
                <h2 className="text-3xl font-black italic">CUSTOMER_PROFILE</h2>
                <p className="text-xl font-bold">{customer.customer_name || "VALUED_CUSTOMER"}</p>
                <p className="font-bold text-zinc-500 tracking-widest">{email}</p>
              </div>
            </div>

            {/* GRID DATA DETAIL */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-8">
              {[
                { label: "PHONE", value: customer.phone },
                { label: "ADDRESS", value: customer.address },
                { label: "CITY", value: customer.city },
                { label: "PROVINCE", value: customer.province },
                { label: "DISTRICT", value: customer.district },
              ].map((item, i) => (
                <div key={i} className="border-b-2 border-zinc-200 pb-2">
                  <p className="text-[10px] font-black text-orange-500 tracking-[0.2em]">{item.label}</p>
                  <p className="text-lg font-black italic">{item.value || "-"}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORDER HISTORY */}
        <div className="bg-white border-2 border-black shadow-[8px_8px_0px_#000] overflow-hidden">
          <div className="p-5 border-b-2 border-black bg-zinc-50 flex justify-between items-center">
            <h3 className="font-black tracking-widest">ORDER_HISTORY ({orders.length})</h3>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black text-white text-[10px] tracking-[.3em] font-black">
                <th className="p-5">ORDER_ID</th>
                <th className="p-5">STATUS</th>
                <th className="p-5 text-right">AMOUNT</th>
                <th className="p-5 text-center">DATE</th>
              </tr>
            </thead>
            <tbody className="text-[11px] font-bold">
              {orders.map((order) => {
                const statusInfo = getStatusDisplay(order.status);
                return (
                  <tr key={order.id_order} className="border-b border-zinc-100 hover:bg-zinc-50">
                    <td className="p-5 font-mono">{order.order_id}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 font-black ${statusInfo.style}`}>{statusInfo.label}</span>
                    </td>
                    <td className="p-5 text-right font-mono">Rp{Number(order.total_amount).toLocaleString("id-ID")}</td>
                    <td className="p-5 text-center">{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CustomerProfile;
