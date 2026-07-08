import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

// Asset
import backgroundJournal from '../../assets/img/backgroundshop.png'; 

const Issues = () => {
  const navigate = useNavigate();
  
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const API_ISSUES = 'http://localhost:5000/api/issues';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(API_ISSUES);
        
        // Memastikan data yang diambil adalah array
        const rawData = Array.isArray(res.data) ? res.data : (res.data.data || []);
        
        setIssues(rawData);
      } catch (err) {
        console.error("ISSUES_FETCH_ERROR:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter berdasarkan nama atau deskripsi
  const filteredIssues = issues.filter(item => 
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div 
      className="min-h-screen bg-fixed bg-cover bg-center text-black font-sans pb-20 uppercase font-bold"
      style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(${backgroundJournal})` }}
    >
      
      {/* --- HERO HEADER --- */}
      <div className="bg-black text-white pt-28 pb-20 px-6 border-b-12px border-[#f97316]">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#f97316] font-black tracking-[0.6em] text-[10px] uppercase mb-4 italic animate-pulse">
            System // Current_Active_Issues
          </p>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-none select-none italic">
            SERIES ISSUES <span className="text-[#f97316]">.</span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-10">
        
        {/* --- SEARCH SECTION --- */}
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div className="flex items-center gap-4 bg-white border-4 border-black p-5 shadow-[10px_10px_0px_#000] w-full lg:max-w-xl transition-all focus-within:translate-x-1 focus-within:translate-y-1 focus-within:shadow-none">
            <SearchIcon sx={{ fontSize: 32 }} />
            <input 
              type="text" 
              placeholder="SEARCH_ISSUE_REPORTS..." 
              className="w-full outline-none font-black text-xl uppercase placeholder:text-zinc-400 bg-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* --- GRID SYSTEM --- */}
        <div className="mt-20">
          {loading ? (
            <div className="text-center py-20 font-black italic uppercase tracking-widest animate-pulse">
              SCANNING_SYSTEM_LOGS...
            </div>
          ) : filteredIssues.length === 0 ? (
            <div className="text-center py-20 border-4 border-dashed border-black font-black italic uppercase tracking-widest bg-white/50">
              NO_ISSUE_REPORTS_FOUND_IN_THIS_SECTOR.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 items-stretch">
              {filteredIssues.map((item) => (
                <div 
                  // 1. DISINKRONKAN: Menggunakan item.id_issue sebagai Key React
                  key={item.id_issue}
                  className="group relative bg-white border-4 border-black hover:shadow-[15px_15px_0px_#f97316] transition-all duration-300 cursor-pointer flex flex-col h-full"
                  // 2. DISINKRONKAN: Parameter rute navigasi diarahkan ke item.id_issue
                  onClick={() => navigate(`/issues/detail/${item.id_issue}`)}
                >
                  {/* Image Container */}
                  <div className="aspect-4/3 overflow-hidden border-b-4 border-black bg-zinc-900 relative shrink-0">
                    <img 
                      src={item.image_url || 'https://via.placeholder.com/800x600?text=NO_VISUAL_DATA'} 
                      alt={item.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-80 group-hover:opacity-100"
                    />
                    
                    {/* Status Tag Overlay */}
                    <div className="absolute top-4 left-4 bg-[#f97316] text-black px-3 py-1 text-[9px] tracking-widest border border-black font-black">
                      ACTIVE_REPORT
                    </div>

                    <div className="absolute inset-0 bg-[#f97316]/0 group-hover:bg-[#f97316]/10 transition-all duration-300"></div>
                    
                    <button className="absolute bottom-4 right-4 bg-black text-[#f97316] p-3 border-2 border-[#f97316] translate-y-20 group-hover:translate-y-0 transition-transform duration-500 flex items-center gap-2 font-black text-[10px] uppercase shadow-[4px_4px_0px_#000]">
                      <RemoveRedEyeIcon fontSize="small" />
                      VIEW_ANALYSIS
                    </button>
                  </div>

                  {/* Content Container */}
                  <div className="p-8 flex flex-col flex-1 bg-white font-black relative overflow-hidden">
                    <span className="absolute -bottom-6 -right-4 text-8xl text-zinc-100 italic select-none -z-10 group-hover:text-zinc-200 transition-colors">
                      ISS
                    </span>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-1">
                            <WarningAmberIcon sx={{ fontSize: 14, color: '#f97316' }} />
                            <span className="text-[10px] text-[#f97316] tracking-tighter">
                              {/* 3. DISINKRONKAN: Potongan kode REF_ID merujuk ke properti item.id_issue */}
                              REF_ID: {String(item.id_issue || '').slice(0, 8).toUpperCase()}
                            </span>
                        </div>
                        {/* Menampilkan level secara dinamis jika dikirim oleh backend */}
                        <span className="text-[10px] text-zinc-400 font-bold">
                          {item.level ? item.level.toUpperCase() : 'SEC_LEVEL_01'}
                        </span>
                      </div>
                      
                      <h3 className="text-3xl uppercase leading-tight group-hover:text-[#f97316] transition-colors duration-300 decoration-[#f97316] group-hover:underline decoration-4 italic">
                        {item.name}
                      </h3>
                    </div>
                    
                    <p className="text-[11px] text-zinc-500 line-clamp-3 mb-6 font-bold normal-case leading-relaxed">
                      {item.description || 'NO_DATA_REPORTED_FOR_THIS_ENTRY.'}
                    </p>

                    <div className="mt-auto pt-4 border-t-2 border-zinc-100 flex items-center justify-between">
                      <span className="text-[9px] tracking-[0.2em] text-zinc-400 group-hover:text-black transition-colors italic">
                        ASHFALL_ISSUE_TRACKER_v2.6
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Issues;