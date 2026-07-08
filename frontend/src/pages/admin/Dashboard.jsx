import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';

// Icons
import Inventory2Icon from '@mui/icons-material/Inventory2';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CategoryIcon from '@mui/icons-material/Category';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import RefreshIcon from '@mui/icons-material/Refresh';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BugReportIcon from '@mui/icons-material/BugReport';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const Dashboard = () => {
  const [data, setData] = useState({
    products: [],
    stores: [],
    categories: [],
    issues: [],
    journals: [],
    collaborations: [],
    orders: [],
    loading: true
  });

  const fetchData = async () => {
    setData(prev => ({ ...prev, loading: true }));
    try {
      const [prodRes, storeRes, catRes, issueRes, journalRes, colabRes, orderRes] = await Promise.allSettled([
        axios.get('http://localhost:5000/api/products'),
        axios.get('http://localhost:5000/api/stores'),
        axios.get('http://localhost:5000/api/categories'),
        axios.get('http://localhost:5000/api/issues'),
        axios.get('http://localhost:5000/api/journals'),
        axios.get('http://localhost:5000/api/collaborations'),
        axios.get('http://localhost:5000/api/orders')
      ]);

      setData({
        products: prodRes.status === 'fulfilled' ? prodRes.value.data : [],
        stores: storeRes.status === 'fulfilled' ? storeRes.value.data : [],
        categories: catRes.status === 'fulfilled' ? catRes.value.data : [],
        issues: issueRes.status === 'fulfilled' ? issueRes.value.data : [],
        journals: journalRes.status === 'fulfilled' ? journalRes.value.data : [],
        collaborations: colabRes.status === 'fulfilled' ? colabRes.value.data : [],
        orders: orderRes.status === 'fulfilled' ? orderRes.value.data : [],
        loading: false
      });
    } catch (err) {
      console.error("CRITICAL_SYNC_ERROR:", err);
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = [
    { label: "TOTAL_PRODUCTS", value: data.products.length, icon: <Inventory2Icon />, color: "bg-white text-black" },
    { label: "TOTAL_ORDERS", value: data.orders.length, icon: <ReceiptLongIcon />, color: "bg-black text-white" },
    { label: "TOTAL_ISSUES", value: data.issues.length, icon: <BugReportIcon />, color: "bg-white text-red-600" },
    { label: "TOTAL_JOURNALS", value: data.journals.length, icon: <MenuBookIcon />, color: "bg-white text-black" },
    { label: "COLLABORATIONS", value: data.collaborations.length, icon: <HandshakeIcon />, color: "bg-[#f97316] text-white" },
    { label: "TOTAL_STORES", value: data.stores.length, icon: <StorefrontIcon />, color: "bg-white text-black" },
    { label: "CATEGORIES", value: data.categories.length, icon: <CategoryIcon />, color: "bg-white text-black" },
    { label: "OUT_OF_STOCK", value: data.products.filter(p => p.stock === 0).length, icon: <WarningAmberIcon />, color: "bg-red-50 text-red-600" },
  ];

  // Data Diagram Terintegrasi
  const chartData = [
    { name: "PRODUCTS", total: data.products.length, color: "bg-black" },
    { name: "ORDERS", total: data.orders.length, color: "bg-[#f97316]" },
    { name: "ISSUES", total: data.issues.length, color: "bg-red-500" },
    { name: "JOURNALS", total: data.journals.length, color: "bg-zinc-800" },
    { name: "COLAB", total: data.collaborations.length, color: "bg-orange-400" },
    { name: "STORES", total: data.stores.length, color: "bg-zinc-400" },
  ];

  const maxVal = Math.max(...chartData.map(d => d.total), 1);

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-4 border-black pb-6">
          <div>
            <h2 className="text-5xl font-black tracking-tighter italic uppercase leading-none">Dashboard</h2>
            <p className="text-[10px] tracking-[0.4em] text-zinc-500 font-bold mt-2 uppercase italic">
              Terminal_Sync: {data.loading ? "Processing..." : "Ready"} // Real-Time_System_Overview
            </p>
          </div>
          <button 
            onClick={fetchData}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 font-black text-xs tracking-widest uppercase border-2 border-black hover:bg-[#f97316] shadow-[4px_4px_0px_#ccc] active:shadow-none active:translate-x-1 transition-all"
          >
            <RefreshIcon className={data.loading ? "animate-spin" : ""} sx={{ fontSize: 18 }} />
            Refresh_System
          </button>
        </div>

        {/* STATS GRID (8 CARDS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className={`${stat.color} border-2 border-black p-6 shadow-[6px_6px_0px_#000] flex flex-col justify-between h-40 group hover:-translate-y-1 transition-all`}>
              <div className="flex justify-between items-start">
                <span className="p-2 border-2 border-black bg-white text-black group-hover:bg-black group-hover:text-white transition-colors">
                  {stat.icon}
                </span>
                <TrendingUpIcon sx={{ fontSize: 16, opacity: 0.3 }} />
              </div>
              <div>
                <p className="text-[9px] font-black tracking-[0.2em] opacity-70 uppercase italic">{stat.label}</p>
                <h3 className="text-3xl font-black tracking-tighter mt-1 leading-none italic">{data.loading ? "..." : stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* INTERACTIVE DIAGRAM (Warna Gelap & Kontras) */}
          <div className="lg:col-span-2 bg-zinc-50 border-4 border-black p-8 shadow-[12px_12px_0px_#000]">
            <div className="flex justify-between items-center mb-12">
              <h4 className="font-black tracking-[0.2em] text-sm uppercase italic">
                <span className="bg-[#f97316] text-white px-2 py-1 mr-2">LIVE</span> 
                Metric_Distribution
              </h4>
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-black"></div>
                <div className="w-3 h-3 bg-[#f97316]"></div>
              </div>
            </div>
            
            {/* Functional Interactive Chart */}
            <div className="flex items-end justify-between h-64 gap-4 px-4 border-b-4 border-black relative">
              {/* Background Lines */}
              <div className="absolute inset-0 flex flex-col justify-between opacity-10 pointer-events-none">
                {[...Array(5)].map((_, i) => <div key={i} className="border-t-2 border-black w-full"></div>)}
              </div>

              {chartData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center group relative z-10">
                  {/* Tooltip on Hover */}
                  <div className="absolute -top-12 bg-black text-white text-[10px] font-black px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase">
                    Total: {d.total}
                  </div>
                  
                  {/* The Bar */}
                  <div 
                    style={{ height: `${(d.total / maxVal) * 100}%`, minHeight: '4px' }} 
                    className={`w-full ${d.color} border-2 border-b-0 border-black group-hover:scale-x-105 group-hover:brightness-125 transition-all shadow-[4px_0px_0px_rgba(0,0,0,0.1)]`}
                  >
                  </div>

                  {/* Label */}
                  <div className="absolute -bottom-10 w-full text-center">
                    <span className="text-[9px] font-black text-black uppercase tracking-tighter block rotate-[-15deg] group-hover:rotate-0 transition-transform">
                      {d.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LOGS SECTION */}
          <div className="bg-black text-white border-4 border-black p-8 shadow-[12px_12px_0px_#f97316]">
            <div className="flex items-center gap-3 mb-10 border-b border-zinc-800 pb-4">
              <NotificationsActiveIcon className="text-[#f97316]" />
              <h4 className="font-black tracking-widest text-sm uppercase italic">System_Activity</h4>
            </div>

            <div className="space-y-8">
              <div className="group cursor-default">
                <p className="text-[#f97316] text-[8px] font-black tracking-widest mb-1 uppercase italic group-hover:translate-x-1 transition-transform">#001_INVENTORY</p>
                <p className="text-[11px] font-bold leading-snug uppercase tracking-tight">
                  {data.products.length} Products currently mapped in core database.
                </p>
              </div>

              <div className="group cursor-default">
                <p className="text-[#f97316] text-[8px] font-black tracking-widest mb-1 uppercase italic group-hover:translate-x-1 transition-transform">#002_LOGISTICS</p>
                <p className="text-[11px] font-bold leading-snug uppercase tracking-tight">
                  {data.orders.length} Active orders pending processing.
                </p>
              </div>

              <div className="group cursor-default border-t border-zinc-800 pt-4">
                <p className="text-red-500 text-[8px] font-black tracking-widest mb-1 uppercase italic">#003_ALERTS</p>
                <p className="text-[11px] font-bold leading-snug uppercase tracking-tight text-red-200">
                  {data.issues.length} System issues require immediate attention.
                </p>
              </div>
            </div>

            <button className="w-full mt-12 py-4 bg-white text-black border-2 border-black text-[10px] font-black tracking-[0.3em] hover:bg-[#f97316] hover:text-white transition-all uppercase italic">
              Generate_Full_Report
            </button>
          </div>

        </div>

      </div>
    </AdminLayout>
  );
};

export default Dashboard;