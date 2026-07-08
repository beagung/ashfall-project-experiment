import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import backgroundShop from "../../assets/img/backgroundshop.png";

// Import Icon dari Material UI
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk menentukan warna dan label status agar sinkron dengan Admin
  const getStatusDisplay = (status) => {
    switch (status) {
      case "pending":
        return { label: "WAITING_PAYMENT", style: "bg-yellow-400 text-black" };
      case "paid":
        return { label: "PAYMENT_RECEIVED", style: "bg-blue-500 text-white" };
      case "settlement":
        return { label: "ORDER_VERIFIED", style: "bg-blue-500 text-white" };
      case "shipping":
        return { label: "ON_THE_WAY", style: "bg-green-500 text-white" };
      case "cancel":
        return { label: "ORDER_CANCELLED", style: "bg-red-500 text-white" };
      default:
        return { label: status?.toUpperCase() || "UNKNOWN", style: "bg-zinc-200 text-black" };
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const resProfile = await axios.get(`http://localhost:5000/api/profiles/${id}`);
        setProfile(resProfile.data);

        try {
          const resOrders = await axios.get(`http://localhost:5000/api/orders/user/${id}`);
          setOrders(resOrders.data);
        } catch (orderErr) {
          console.warn("Belum ada riwayat pesanan.");
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const isProfileIncomplete = profile && (!profile.full_name || !profile.phone || !profile.address || !profile.province || !profile.city || !profile.district);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center font-black italic animate-pulse text-xl">DECRYPTING_DATA...</div>;
  }

  return (
    <div className="min-h-screen bg-fixed bg-cover bg-center text-black font-sans pb-20 uppercase font-bold" style={{ backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.92), rgba(255,255,255,0.92)), url(${backgroundShop})` }}>
      {/* HERO HEADER */}
      <div className="border-b-8 border-orange-500 bg-black px-6 pt-32 pb-24 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 animate-pulse italic text-xs font-black uppercase tracking-widest text-orange-500">System_Profile // Identity</p>
          <h1 className="leading-none select-none text-6xl md:text-9xl font-black italic uppercase tracking-tighter">
            PROFILE<span className="text-orange-500">.</span>
          </h1>
        </div>
      </div>

      <div className="mx-auto -mt-12 max-w-4xl px-6">
        {/* WARNING BANNER */}
        {isProfileIncomplete && (
          <div className="mb-10 border-4 border-black bg-white p-8 shadow-[8px_8px_0px_#000]">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="flex items-center gap-4">
                <WarningAmberIcon sx={{ fontSize: 40, color: "#f97316" }} />
                <div>
                  <h3 className="italic text-xl font-black text-black">ACTION_REQUIRED</h3>
                  <p className="text-[10px] font-black tracking-[0.2em] text-zinc-500">PLEASE COMPLETE YOUR PROFILE DETAILS.</p>
                </div>
              </div>
              <button onClick={() => navigate(`/profile/edit/${id}`)} className="whitespace-nowrap border-2 border-black bg-orange-500 px-8 py-3 font-black text-black transition-all hover:bg-black hover:text-white">
                UPDATE_PROFILE
              </button>
            </div>
          </div>
        )}

        {/* MAIN CARD */}
        <div className="border-4 border-black bg-white p-8 shadow-2xl md:p-12">
          <div className="mb-10 flex flex-col items-center gap-8 border-b-4 border-black pb-10 md:flex-row md:items-start">
            <div className="h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-black bg-zinc-100 shadow-lg md:h-40 md:w-40">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-black text-5xl font-black italic text-white">{profile?.full_name?.charAt(0) || "U"}</div>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="mb-2 text-4xl md:text-5xl font-black italic tracking-tighter">{profile?.full_name || "GUEST_USER"}</h2>
              <p className="mb-6 text-sm font-bold tracking-widest text-orange-600">{profile?.email || "NO_EMAIL_PROVIDED"}</p>
              <button onClick={() => navigate(`/profile/edit/${id}`)} className="border-2 border-black bg-black px-6 py-2 text-xs font-black tracking-widest text-white transition-all hover:bg-orange-500">
                EDIT_PROFILE
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
            {[
              { label: "PHONE_NUMBER", value: profile?.phone },
              { label: "ADDRESS", value: profile?.address },
              { label: "CITY", value: profile?.city },
              { label: "PROVINCE", value: profile?.province },
              { label: "DISTRICT", value: profile?.district },
            ].map((item, i) => (
              <div key={i} className="border-b-2 border-zinc-200 pb-2">
                <p className="text-[10px] font-black tracking-[0.2em] text-orange-500">{item.label}</p>
                <p className="text-lg font-black italic">{item.value || "-"}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ORDER HISTORY SECTION */}
        <div className="mt-10 border-4 border-black bg-white p-8 shadow-[8px_8px_0px_#000] mb-20">
          <h2 className="mb-8 text-3xl font-black italic tracking-tighter">ORDER_HISTORY</h2>
          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => {
                const statusInfo = getStatusDisplay(order.status);
                return (
                  <div key={order.id_order} className="border-2 border-black p-6 hover:bg-zinc-50 transition-colors">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-[10px] font-black text-orange-500 tracking-[0.2em]">ORDER_ID</p>
                        <p className="font-black italic">#{order.order_id?.split("-")[1] || order.order_id}</p>
                      </div>
                      <div className={`px-4 py-1 border-2 border-black font-black text-[10px] uppercase ${statusInfo.style}`}>{statusInfo.label}</div>
                    </div>
                    <p className="text-sm font-bold">TOTAL: Rp{parseInt(order.total_amount).toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="font-bold italic text-zinc-500">NO_TRANSACTION_HISTORY_FOUND.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
