import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PersonIcon from '@mui/icons-material/Person';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentsIcon from '@mui/icons-material/Payments';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

const DetailOrders = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/orders/admin/detail/${id}`);
        
        let rawData = res.data;

        // Fungsi pembersihan data items (JSONB parsing)
        const cleanItems = (itemsData) => {
          if (!itemsData) return [];
          let parsed = itemsData;
          while (typeof parsed === 'string') {
            try {
              parsed = JSON.parse(parsed);
            } catch (e) {
              console.error("Final parse error:", e);
              break; 
            }
          }
          return Array.isArray(parsed) ? parsed : [];
        };

        rawData.items = cleanItems(rawData.items);
        setOrder(rawData);
      } catch (err) {
        console.error("FETCH_ERROR:", err);
        alert("ACCESS_DENIED: ORDER_NOT_FOUND");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrderDetail();
  }, [id]);

  if (loading) return (
    <AdminLayout>
      <div className="font-black p-10 italic animate-pulse uppercase tracking-widest text-zinc-400">
        Parsing_Log_Files...
      </div>
    </AdminLayout>
  );

  if (!order) return (
    <AdminLayout>
      <div className="font-black p-10 text-red-600 uppercase border-4 border-red-600 shadow-[8px_8px_0px_#000]">
        Null_Order_Reference
      </div>
    </AdminLayout>
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'settlement':
      case 'capture': return 'bg-green-500';
      case 'pending': return 'bg-yellow-400';
      case 'deny':
      case 'cancel':
      case 'expire': return 'bg-red-500 text-white';
      default: return 'bg-zinc-400';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 p-4 md:p-8">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-8 border-black pb-8 uppercase">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => navigate('/admin/manage-orders')}
              className="p-4 border-4 border-black hover:bg-[#f97316] hover:text-white transition-all shadow-[6px_6px_0px_#000] bg-white"
            >
              <ArrowBackIcon />
            </button>
            <div>
              <p className="text-[10px] font-black tracking-[0.4em] text-zinc-400 italic leading-none mb-2 underline decoration-[#f97316]">
                Internal_Log // {order.id}
              </p>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic leading-none">
                ORDER_#{order.order_id.split('-')[1] || order.order_id}
              </h2>
            </div>
          </div>

          <div className={`border-4 border-black px-10 py-5 shadow-[8px_8px_0px_#000] font-black flex items-center gap-3 ${getStatusColor(order.status)}`}>
             <PaymentsIcon sx={{ fontSize: 24 }} />
             <span className="tracking-widest italic text-xl">{order.status}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* CUSTOMER & SHIPPING INFO */}
          <div className="lg:col-span-4 space-y-8 uppercase">
            <div className="bg-white border-4 border-black p-6 shadow-[10px_10px_0px_#000]">
              <div className="flex items-center gap-3 mb-6 border-b-4 border-black pb-3 text-[#f97316]">
                <PersonIcon />
                <h4 className="font-black text-lg tracking-tighter italic">CUSTOMER_MANIFEST</h4>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[9px] font-black text-zinc-400">IDENTIFIER</p>
                  <p className="font-black text-2xl italic leading-none">{order.customer_name}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-zinc-400">EMAIL</p>
                  <p className="font-bold text-xs lowercase break-all underline">{order.email}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-zinc-400">PHONE_CONTACT</p>
                  <p className="font-black text-lg italic">{order.phone || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border-4 border-black p-6 shadow-[10px_10px_0px_#000]">
              <div className="flex items-center gap-3 mb-6 border-b-4 border-black pb-3 text-[#f97316]">
                <LocalShippingIcon />
                <h4 className="font-black text-lg tracking-tighter italic">LOGISTICS_INFO</h4>
              </div>
              <p className="font-bold text-sm leading-relaxed italic">{order.address}</p>
              <div className="mt-4 flex flex-wrap gap-2 uppercase">
                <span className="bg-black text-white text-[10px] px-2 py-1 font-black italic">{order.province}</span>
                <span className="bg-black text-white text-[10px] px-2 py-1 font-black italic">{order.city}</span>
                <span className="bg-black text-white text-[10px] px-2 py-1 font-black italic">{order.district}</span>
              </div>
            </div>
          </div>

          {/* ITEM TABLE SECTION */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white border-4 border-black shadow-[12px_12px_0px_#000] overflow-hidden uppercase">
              <div className="bg-black text-white px-6 py-4 flex items-center gap-3">
                <ReceiptIcon sx={{ color: '#f97316' }} />
                <h4 className="text-xs font-black tracking-[0.2em] italic">ORDERED_ARTICLES</h4>
              </div>
              
              <div className="overflow-x-auto overflow-y-hidden">
                <table className="w-full text-left" style={{ width: '100%', minWidth: '600px' }}>
                  <thead>
                    <tr className="border-b-4 border-black text-[11px] font-black bg-zinc-100 uppercase italic">
                      <th className="p-5">PRODUCT_DESC</th>
                      <th className="p-5 text-center">SIZE_ID</th>
                      <th className="p-5 text-center">QTY</th>
                      <th className="p-5 text-right">SUBTOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items?.map((item, idx) => (
                      <tr key={idx} className="border-b-2 border-zinc-200 hover:bg-zinc-50 transition-colors">
                        <td className="p-5">
                          <div className="flex flex-col">
                            <span className="font-black text-lg italic tracking-tight">{item.name}</span>
                            <span className="text-[9px] text-[#f97316] font-black">SKU_ID: {item.id || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="p-5 text-center">
                          {/* PERBAIKAN: Akses properti 'size' yang dikirim backend */}
                          <span className="bg-black text-white px-4 py-1 font-[1000] text-xs shadow-[3px_3px_0px_#f97316] inline-block min-w-45px italic">
                            {item.size || item.selectedSize || "N/A"}
                          </span>
                        </td>
                        <td className="p-5 text-center font-black text-lg italic tracking-tighter">
                          {item.quantity}X
                        </td>
                        <td className="p-5 text-right font-black text-[#f97316] italic text-lg">
                          RP {((Number(item.price) || 0) * (Number(item.quantity) || 0)).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* TOTAL BOX */}
              <div className="bg-black text-white p-10 flex flex-col items-end border-t-8 border-[#f97316]">
                <span className="text-[12px] font-black text-[#f97316] tracking-[0.4em] mb-2 uppercase italic">TOTAL_SETTLEMENT</span>
                <span className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none">
                  RP {order.total_amount?.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* TRANSACTION ID FOOTER */}
            <div className="bg-zinc-900 border-4 border-black p-6 text-[#f97316] shadow-[8px_8px_0px_#000] flex items-center gap-4">
              <ConfirmationNumberIcon fontSize="large" />
              <div>
                <p className="text-[10px] font-black text-zinc-500 tracking-[0.3em] uppercase italic">System_Transaction_ID</p>
                <p className="text-xl font-black italic break-all text-white tracking-widest">{order.order_id}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DetailOrders;