import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import StorefrontIcon from '@mui/icons-material/Storefront';

// Asset
import backgroundStore from '../../assets/img/backgroundshop.png'; 

const Stores = () => {
  const navigate = useNavigate();
  
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const API_STORES = 'http://127.0.0.1:5000/api/stores';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(API_STORES);
        
        // Memastikan data yang diambil adalah array sesuai struktur backend Anda
        const rawData = Array.isArray(res.data) ? res.data : (res.data.data || []);
        
        setStores(rawData);
      } catch (err) {
        console.error("STORES_FETCH_ERROR:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter berdasarkan nama, deskripsi, atau alamat
  const filteredStores = stores.filter(item => 
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div 
      className="min-h-screen bg-fixed bg-cover bg-center text-black font-sans pb-20 uppercase font-bold"
      style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(${backgroundStore})` }}
    >
      
      {/* --- HERO HEADER --- */}
      <div className="bg-black text-white pt-28 pb-20 px-6 border-b-12px border-[#f97316]">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#f97316] font-black tracking-[0.6em] text-[10px] uppercase mb-4 italic animate-pulse" style={{ fontStyle: 'italic' }}>
            Distribution // Official_Stockists_Network
          </p>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-none select-none" style={{ fontStyle: 'italic' }}>
            STORES<span className="text-[#f97316]">.</span>
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
              placeholder="FIND_NEAREST_LOCATION..." 
              className="w-full outline-none font-black text-xl uppercase placeholder:text-zinc-400 bg-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* --- GRID SYSTEM --- */}
        <div className="mt-20">
          {loading ? (
            <div className="text-center py-20 font-black italic uppercase tracking-widest animate-pulse" style={{ fontStyle: 'italic' }}>
              LOCATING_PARTNER_NODES...
            </div>
          ) : filteredStores.length === 0 ? (
            <div className="text-center py-20 border-4 border-dashed border-black font-black italic uppercase tracking-widest bg-white/50" style={{ fontStyle: 'italic' }}>
              NO_STORES_FOUND_IN_THIS_REGION.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 items-stretch">
              {filteredStores.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => navigate(`/stores/detail/${item.id}`)}
                  className="group relative bg-white border-4 border-black hover:shadow-[15px_15px_0px_#f97316] transition-all duration-300 flex flex-col h-full"
                >
                  {/* Image Container */}
                  <div className="aspect-video overflow-hidden border-b-4 border-black bg-zinc-900 relative shrink-0">
                    <img 
                      src={item.image || 'https://via.placeholder.com/800x450?text=STORE_VISUAL'} 
                      alt={item.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-80 group-hover:opacity-100"
                    />
                    
                    {/* Status Tag Overlay */}
                    <div className="absolute top-4 left-4 bg-black text-[#f97316] px-3 py-1 text-[9px] tracking-widest border border-[#f97316] font-black">
                      OFFICIAL_STOCKIST
                    </div>

                    {/* Quick Link Map */}
                    {item.address && (
                        <a 
                            href={item.address} 
                            target="_blank" 
                            rel="noreferrer"
                            className="absolute bottom-4 right-4 bg-white text-black p-3 border-2 border-black translate-y-20 group-hover:translate-y-0 transition-transform duration-500 flex items-center gap-2 font-black text-[10px] uppercase shadow-[4px_4px_0px_#000] hover:bg-black hover:text-white"
                        >
                            <LocationOnIcon fontSize="small" />
                            OPEN_MAPS
                        </a>
                    )}
                  </div>

                  {/* Content Container */}
                  <div className="p-8 flex flex-col flex-1 bg-white font-black relative overflow-hidden">
                    {/* Decorative Background Text */}
                    <span className="absolute -bottom-6 -right-4 text-8xl text-zinc-100 italic select-none -z-10 group-hover:text-zinc-200 transition-colors" style={{ fontStyle: 'italic' }}>
                      STR
                    </span>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-1">
                            <StorefrontIcon sx={{ fontSize: 14, color: '#f97316' }} />
                            <span className="text-[10px] text-[#f97316] tracking-tighter">
                                STORE_UID: {String(item.id).padStart(3, '0')}
                            </span>
                        </div>
                        <span className="text-[10px] text-zinc-400 font-bold uppercase">
                          Authorized
                        </span>
                      </div>
                      
                      <h3 className="text-3xl uppercase leading-tight group-hover:text-[#f97316] transition-colors duration-300" style={{ fontStyle: 'italic' }}>
                        {item.name}
                      </h3>
                    </div>
                    
                    <p className="text-[11px] text-zinc-500 line-clamp-3 mb-6 font-bold normal-case leading-relaxed">
                      {item.description || 'NO_STORE_DESCRIPTION_AVAILABLE.'}
                    </p>

                    <div className="mt-auto pt-4 border-t-2 border-zinc-100 flex items-center justify-between">
                      <span className="text-[9px] tracking-[0.2em] text-zinc-400 group-hover:text-black transition-colors" style={{ fontStyle: 'italic' }}>
                        ASHFALL_DISTRIBUTION_v2.6
                      </span>
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[8px] text-zinc-400 italic">LIVE_LOCATION</span>
                      </div>
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

export default Stores;