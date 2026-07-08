import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TagIcon from "@mui/icons-material/Tag";
import LabelIcon from "@mui/icons-material/Label";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

// Asset
import backgroundJournal from "../../assets/img/backgroundshop.png";

const DetailJournal = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/journals/${id}`);
        // Jika backend mengirim { data: {...} }, ambil data-nya. Jika langsung objek, ambil res.data
        const data = res.data.data || res.data;
        setJournal(data);
      } catch (err) {
        console.error("DETAIL_FETCH_ERROR:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center font-black animate-pulse tracking-[0.5em] text-zinc-400 italic">DECRYPTING_JOURNAL_CORE...</div>;

  if (!journal)
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <h1 className="text-4xl font-black text-red-600 mb-4 uppercase italic">NULL_REFERENCE_ERROR</h1>
        <button onClick={() => navigate(-1)} className="border-2 border-black px-6 py-2 font-black uppercase shadow-[4px_4px_0px_#000] italic">
          Return_to_Archive
        </button>
      </div>
    );

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center text-black font-sans p-2 md:p-6 pb-20 uppercase font-bold"
      style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.92), rgba(255,255,255,0.92)), url(${backgroundJournal})` }}
    >
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* TOP NAVIGATION */}
        <div className="flex items-center gap-5 border-b-4 border-black pb-8 pt-4">
          <button onClick={() => navigate(-1)} className="p-4 border-2 border-black bg-white hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_#000] active:shadow-none">
            <ArrowBackIcon />
          </button>
          <div>
            <p className="text-[10px] font-black tracking-[0.4em] text-[#f97316] mb-1 uppercase animate-pulse italic">Archive_Ref // {journal.category || "GENERAL_ENTRY"}</p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none italic">{journal.title}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT: VISUAL DATA */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative group border-4 border-black bg-white aspect-4/5 overflow-hidden shadow-[12px_12px_0px_#000]">
              <img src={journal.image || "https://via.placeholder.com/1200x1500?text=NO_VISUAL_DATA"} alt={journal.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
              <div className="absolute top-4 left-4 bg-black text-white px-4 py-1 text-[10px] border-2 border-white/20 italic">
                {/* Memperbaiki akses ID */}
                ENTRY_ID:{" "}
                {String(journal.id_journal || journal.id || "0000")
                  .slice(0, 8)
                  .toUpperCase()}
              </div>
            </div>

            <div className="bg-zinc-100 border-2 border-black p-4 flex items-center justify-between shadow-[4px_4px_0px_#000]">
              <div className="flex items-center gap-3">
                <LabelIcon sx={{ fontSize: 16 }} />
                <p className="text-[10px] font-black tracking-widest uppercase italic">System_Classification</p>
              </div>
              <p className="text-xs font-black uppercase tracking-tighter text-[#f97316] italic">{journal.category || "UNCLASSIFIED"}</p>
            </div>
          </div>

          {/* RIGHT: TEXT CONTENT */}
          <div className="lg:col-span-6 space-y-8">
            <div className="bg-black text-white p-8 border-2 border-black shadow-[8px_8px_0px_#f97316]">
              <div className="flex items-center gap-3 text-[#f97316] mb-4">
                <TagIcon sx={{ fontSize: 18 }} />
                <span className="text-[10px] font-black tracking-widest uppercase italic">Data_Classification</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-black tracking-tighter leading-none uppercase italic">{journal.category || "GENERAL_FILE"}</h3>
            </div>

            <div className="bg-white border-4 border-black p-8 shadow-[10px_10px_0px_#000] relative">
              <div className="absolute -top-4 left-6 bg-black text-white px-4 py-1 border-2 border-black font-black text-[10px] uppercase tracking-widest italic">Log_Transcript</div>
              <div className="text-sm font-bold leading-relaxed text-zinc-700 uppercase mt-2 italic">{journal.description || "NO_DESCRIPTION_AVAILABLE."}</div>
            </div>

            {/* INFO BOX */}
            <div className="bg-zinc-50 border-2 border-black p-6 shadow-[6px_6px_0px_#000]">
              <div className="flex items-center gap-4">
                <RemoveRedEyeIcon className="text-[#f97316]" />
                <div>
                  <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-tighter">Status</p>
                  <p className="font-black text-xs uppercase text-green-600 italic">{journal.status || "PUBLISHED"}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-black/10 flex justify-between items-center opacity-40">
              <span className="text-[9px] font-black tracking-widest uppercase italic">End_Of_Archive_Entry</span>
              <span className="text-[9px] font-black uppercase">v2.6_Core</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailJournal;
