import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Icons
import SearchIcon from "@mui/icons-material/Search";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import InstagramIcon from "@mui/icons-material/Instagram";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FilterListIcon from "@mui/icons-material/FilterList";
import LockIcon from "@mui/icons-material/Lock";

// Asset
import backgroundCollab from "../../assets/img/backgroundshop.png";

const Collaborations = () => {
  const navigate = useNavigate();

  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [user, setUser] = useState(null); // State untuk cek user login

  const API_COLLABORATIONS = "http://localhost:5000/api/collaborations";

  // Cek status login saat komponen dimuat
  useEffect(() => {
    const userData = localStorage.getItem("user"); // Sesuaikan key storage Anda
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(API_COLLABORATIONS);
        const rawData = Array.isArray(res.data) ? res.data : res.data.data || [];
        setCollaborations(rawData);
      } catch (err) {
        console.error("COLLAB_FETCH_ERROR:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const collabTypes = ["ALL", "Brand Collaboration", "Band Merchandise Collaboration", "Creative Project", "Content Collaboration", "Event Collaboration"];

  const filteredCollabs = collaborations.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "ALL" || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-fixed bg-cover bg-center text-black font-sans pb-20 uppercase font-bold" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(${backgroundCollab})` }}>
      {/* --- HERO HEADER --- */}
      <div className="bg-black text-white pt-28 pb-20 px-6 border-b-12px border-[#f97316]">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#f97316] font-black tracking-[0.6em] text-[10px] uppercase mb-4 italic animate-pulse">Network // Collaboration_Registry_Active</p>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter italic uppercase leading-none select-none">
            COLLABS<span className="text-[#f97316]">.</span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-10">
        <div className="flex flex-col xl:flex-row gap-6 items-stretch">
          <div className="flex items-center gap-4 bg-white border-4 border-black p-5 shadow-[10px_10px_0px_#000] flex-1 transition-all focus-within:translate-x-1 focus-within:translate-y-1 focus-within:shadow-none">
            <SearchIcon sx={{ fontSize: 32 }} />
            <input type="text" placeholder="FIND_PARTNER..." className="w-full outline-none font-black text-xl uppercase placeholder:text-zinc-400 bg-transparent" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative flex items-center bg-white border-4 border-black px-4 py-5 shadow-[10px_10px_0px_#000] min-w-250px">
              <FilterListIcon className="mr-2 text-[#f97316]" />
              <select className="w-full outline-none font-black text-sm uppercase bg-transparent cursor-pointer appearance-none" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                {collabTypes.map((type) => (
                  <option key={type} value={type} className="font-black">
                    {type.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            {/* --- DYNAMIC PROPOSAL BUTTON --- */}
            {user ? (
              <button
                onClick={() => navigate("/collaborations/propose")}
                className="flex items-center justify-center gap-3 bg-[#f97316] text-black border-4 border-black px-8 py-5 shadow-[10px_10px_0px_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-200 group active:bg-orange-500 whitespace-nowrap"
              >
                <AddCircleOutlineIcon sx={{ fontSize: 28 }} className="group-hover:rotate-90 transition-transform duration-300" />
                <span className="font-black text-xl tracking-tighter">PROPOSE_COLLABORATION</span>
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center justify-center gap-3 bg-zinc-200 text-zinc-500 border-4 border-black px-8 py-5 shadow-[10px_10px_0px_#000] cursor-pointer hover:bg-zinc-300 transition-all duration-200 whitespace-nowrap"
              >
                <LockIcon fontSize="small" />
                <span className="font-black text-xl tracking-tighter">LOGIN_TO_PROPOSE</span>
              </button>
            )}
          </div>
        </div>

        {/* --- GRID SYSTEM --- */}
        <div className="mt-20">
          {loading ? (
            <div className="text-center py-20 font-black italic uppercase tracking-widest animate-pulse">ACCESSING_DATABASE...</div>
          ) : filteredCollabs.length === 0 ? (
            <div className="text-center py-20 border-4 border-dashed border-black font-black italic uppercase tracking-widest bg-white/50">NO_COLLABORATIONS_FOUND_IN_THIS_SECTOR.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 items-stretch">
              {filteredCollabs.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-white border-4 border-black hover:shadow-[15px_15px_0px_#f97316] transition-all duration-300 cursor-pointer flex flex-col h-full"
                  onClick={() => navigate(`/collaborations/detail/${item.id}`)}
                >
                  <div className="aspect-square overflow-hidden border-b-4 border-black bg-zinc-900 relative shrink-0">
                    <img
                      src={item.image || "https://via.placeholder.com/800x800?text=NO_IMAGE"}
                      alt={item.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute top-4 left-4 bg-[#f97316] text-black px-3 py-1 text-[9px] tracking-widest border border-black font-black uppercase">{item.type || "PARTNER_v.1"}</div>
                    <button className="absolute bottom-4 right-4 bg-black text-[#f97316] p-3 border-2 border-[#f97316] translate-y-20 group-hover:translate-y-0 transition-transform duration-500 flex items-center gap-2 font-black text-[10px] uppercase shadow-[4px_4px_0px_#000]">
                      <RemoveRedEyeIcon fontSize="small" /> VIEW_DETAILS
                    </button>
                  </div>
                  <div className="p-8 flex flex-col flex-1 bg-white font-black relative overflow-hidden">
                    <h3 className="text-3xl italic uppercase leading-tight group-hover:text-[#f97316] transition-colors duration-300 decoration-[#f97316] group-hover:underline decoration-4">{item.name}</h3>
                    <p className="text-[11px] text-zinc-500 line-clamp-3 mb-6 font-bold normal-case leading-relaxed">{item.description || "NO_DATA_AVAILABLE."}</p>
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

export default Collaborations;
