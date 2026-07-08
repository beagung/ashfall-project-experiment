import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from './AdminLayout';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import DownloadIcon from '@mui/icons-material/Download';
import LinkIcon from '@mui/icons-material/Link';
import BarChartIcon from '@mui/icons-material/BarChart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';

const DetailProposals = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState({ url: '', type: '', title: '' });

  const API_URL = `http://localhost:5000/api/proposals/${id}`;

  useEffect(() => {
    const fetchProposalDetail = async () => {
      try {
        setLoading(true);
        const res = await axios.get(API_URL);
        setProposal(res.data.data);
      } catch (err) {
        console.error("FETCH_ERROR:", err);
        alert("ACCESS_DENIED: PROPOSAL_NOT_FOUND");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProposalDetail();
  }, [id, API_URL]);

  const openPreview = (url, title) => {
    const isPDF = url.toLowerCase().endsWith('.pdf') || url.includes('pdf');
    setPreviewData({ url, type: isPDF ? 'pdf' : 'image', title });
    setIsPreviewOpen(true);
  };

  if (loading) return (
    <AdminLayout>
      <div className="font-black p-10 italic animate-pulse uppercase tracking-widest text-zinc-400">
        Syncing_Proposal_Archives...
      </div>
    </AdminLayout>
  );

  if (!proposal) return (
    <AdminLayout>
      <div className="font-black p-10 text-red-600 uppercase border-4 border-red-600 shadow-[8px_8px_0px_#000] bg-white">
        Null_Proposal_Reference
      </div>
    </AdminLayout>
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'disetujui': return 'bg-green-500';
      case 'pending': return 'bg-yellow-400';
      case 'ditolak': return 'bg-red-500 text-white';
      default: return 'bg-zinc-400';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 p-2 md:p-4">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-8 border-black pb-8 uppercase font-black">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => navigate('/admin/manage-proposals')}
              className="p-4 border-4 border-black hover:bg-[#f97316] hover:text-white transition-all shadow-[6px_6px_0px_#000] bg-white active:translate-x-3px active:translate-y-3px active:shadow-none"
            >
              <ArrowBackIcon />
            </button>
            <div>
              <p className="text-[10px] tracking-[0.4em] text-zinc-400 italic leading-none mb-2 underline decoration-[#f97316]">
                Archive_Log // {proposal.id.slice(0, 8)}
              </p>
              <h2 className="text-4xl md:text-5xl tracking-tighter italic leading-none">
                {proposal.project_title || 'UNTITLED_PROJECT'}
              </h2>
            </div>
          </div>

          <div className={`border-4 border-black px-10 py-5 shadow-[8px_8px_0px_#000] flex items-center gap-3 ${getStatusColor(proposal.status)}`}>
             <span className="tracking-widest italic text-xl uppercase">{proposal.status || 'PENDING'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT SIDE: SENDER INFO */}
          <div className="lg:col-span-4 space-y-8 uppercase font-black">
            <div className="bg-white border-4 border-black p-6 shadow-[10px_10px_0px_#000]">
              <div className="flex items-center gap-3 mb-6 border-b-4 border-black pb-3 text-[#f97316]">
                <PersonIcon />
                <h4 className="text-lg tracking-tighter italic">COLLABORATOR_INFO</h4>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[9px] text-zinc-400 font-bold">NAME</p>
                  <p className="text-2xl italic leading-none">{proposal.full_name}</p>
                </div>
                <div>
                  <p className="text-[9px] text-zinc-400 font-bold">BRAND_ENTITY</p>
                  <p className="text-lg italic text-[#f97316]">{proposal.brand_entity || 'PERSONAL'}</p>
                </div>
                <div className="pt-2 space-y-2 text-xs">
                  <div className="flex items-center gap-2 italic"> <EmailIcon fontSize="small"/> <span className="lowercase">{proposal.email}</span> </div>
                  <div className="flex items-center gap-2 italic"> <WhatsAppIcon fontSize="small"/> {proposal.phone_wa} </div>
                  <div className="flex items-center gap-2 italic"> <LocationOnIcon fontSize="small"/> {proposal.location} </div>
                </div>
              </div>
            </div>

            <div className="bg-black text-white border-4 border-black p-6 shadow-[10px_10px_0px_#f97316]">
              <div className="flex items-center gap-3 mb-6 border-b-2 border-zinc-700 pb-3">
                <BarChartIcon className="text-[#f97316]" />
                <h4 className="text-lg tracking-tighter italic uppercase">Audience_Metrics</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 italic">
                <div>
                  <p className="text-[9px] text-zinc-500 font-bold">FOLLOWERS</p>
                  <p className="text-2xl leading-none">{proposal.followers?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-[9px] text-zinc-500 font-bold">ENGAGEMENT</p>
                  <p className="text-2xl text-[#f97316]">{proposal.engagement || 0}%</p>
                </div>
                <div className="col-span-2 pt-2">
                  <p className="text-[9px] text-zinc-500 font-bold">ESTIMATED_BUDGET</p>
                  <p className="text-2xl">IDR {proposal.budget?.toLocaleString('id-ID') || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: CONTENT & ASSETS */}
          <div className="lg:col-span-8 space-y-8 uppercase font-black">
            <div className="bg-white border-4 border-black shadow-[12px_12px_0px_#000] p-8">
              <h3 className="text-[10px] text-zinc-400 tracking-[0.4em] mb-4 underline decoration-black underline-offset-8">
                // CORE_CONCEPT_STATEMENT
              </h3>
              <p className="text-lg md:text-xl leading-relaxed italic mb-10 border-l-8 border-[#f97316] pl-6">
                "{proposal.core_concept}"
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t-4 border-black pt-8">
                <div> <h4 className="text-[10px] text-zinc-400 mb-2">COLLAB_TYPE</h4> <p className="text-xl italic bg-zinc-100 p-2 border-2 border-black inline-block shadow-[4px_4px_0px_#000]">{proposal.collab_type}</p> </div>
                <div> <h4 className="text-[10px] text-zinc-400 mb-2">PROJECT_TIMELINE</h4> <p className="text-xl italic">{proposal.timeline}</p> </div>
              </div>
            </div>

            {/* ASSETS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 uppercase">
              <AssetCard label="Proposal_PDF" url={proposal.proposal_pdf_url} icon={<FolderZipIcon />} onPreview={() => openPreview(proposal.proposal_pdf_url, "PROPOSAL_DOCUMENT")} />
              <AssetCard label="Media_Kit" url={proposal.media_kit_url} icon={<FolderZipIcon />} onPreview={() => openPreview(proposal.media_kit_url, "MEDIA_KIT_FILE")} />
              <AssetCard label="Logo_Assets" url={proposal.logo_asset_url} icon={<LinkIcon />} onPreview={() => openPreview(proposal.logo_asset_url, "BRAND_LOGO")} />
              <AssetCard label="Portfolio" url={proposal.portfolio_link} icon={<LinkIcon />} isExternal />
            </div>
          </div>
        </div>

        {/* --- PREVIEW MODAL --- */}
        {isPreviewOpen && (
          <div className="fixed inset-0 z-999 flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsPreviewOpen(false)}></div>
            
            {/* Modal Content */}
            <div className="relative w-full max-w-5xl bg-white border-4 border-black shadow-[15px_15px_0px_#f97316] overflow-hidden flex flex-col max-h-[90vh]">
              <div className="bg-black text-white p-4 flex justify-between items-center border-b-4 border-black">
                <div className="flex items-center gap-3">
                  <VisibilityIcon className="text-[#f97316]" />
                  <span className="font-black italic tracking-widest uppercase text-sm">{previewData.title}</span>
                </div>
                <button onClick={() => setIsPreviewOpen(false)} className="hover:text-red-500 transition-colors">
                  <CloseIcon fontSize="large" />
                </button>
              </div>
              
              <div className="flex-1 bg-zinc-200 overflow-auto flex justify-center items-start p-2">
                {previewData.type === 'pdf' ? (
                  <iframe src={previewData.url} className="w-full h-[75vh] border-none shadow-2xl" title="PDF Preview" />
                ) : (
                  <img src={previewData.url} alt="Preview" className="max-w-full h-auto border-4 border-black bg-white shadow-xl" />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

// Sub-component for Asset Cards with View Button
const AssetCard = ({ label, url, icon, onPreview, isExternal = false }) => (
  <div className={`border-4 border-black p-4 flex items-center justify-between transition-all shadow-[6px_6px_0px_#000] bg-white group ${!url && 'opacity-50'}`}>
    <div className="flex items-center gap-3">
      <div className="text-[#f97316]">{icon}</div>
      <span className="font-black text-xs tracking-tighter italic uppercase">{label}</span>
    </div>
    
    <div className="flex gap-2">
      {url && !isExternal && (
        <button 
          onClick={onPreview}
          className="bg-[#f97316] text-black border-2 border-black px-3 py-1 text-[9px] font-black italic shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-2px hover:translate-y-2px transition-all uppercase"
        >
          VIEW_FILE
        </button>
      )}
      
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="bg-black text-white p-2 border-2 border-black hover:bg-zinc-800 transition-colors shadow-[2px_2px_0px_#ccc]">
          {isExternal ? <LinkIcon fontSize="small" /> : <DownloadIcon fontSize="small" />}
        </a>
      ) : (
        <span className="text-[8px] font-black text-zinc-300">N/A</span>
      )}
    </div>
  </div>
);

export default DetailProposals;