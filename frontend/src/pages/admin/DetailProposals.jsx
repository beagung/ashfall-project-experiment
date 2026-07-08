import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../../components/admin/AdminLayout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ProposalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        // Pastikan endpoint backend Anda mengembalikan data dengan struktur { data: { ... } }
        const res = await axios.get(`http://localhost:5000/api/proposals/${id}`);
        setProposal(res.data.data);
      } catch (err) {
        console.error("DETAIL_FETCH_ERROR:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading)
    return (
      <AdminLayout>
        <div className="p-10 font-black">LOADING_DATA...</div>
      </AdminLayout>
    );
  if (!proposal)
    return (
      <AdminLayout>
        <div className="p-10 font-black">PROPOSAL_NOT_FOUND.</div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-8 uppercase">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-black hover:text-[#f97316]">
          <ArrowBackIcon /> BACK_TO_MANAGEMENT
        </button>

        <div className="bg-white border-4 border-black p-10 shadow-[10px_10px_0px_#000]">
          <h1 className="text-4xl font-black italic uppercase mb-8">{proposal.project_title}</h1>

          <div className="grid grid-cols-2 gap-8">
            <DetailItem label="SENDER" value={proposal.full_name} />
            <DetailItem label="BRAND" value={proposal.brand_entity} />
            <DetailItem label="EMAIL" value={proposal.email} />
            <DetailItem label="SOCIAL_ID" value={proposal.social_id} />
            <DetailItem label="TYPE" value={proposal.collab_type} />
            <DetailItem label="LOCATION" value={proposal.location} />
            <DetailItem label="STATUS" value={proposal.status?.toUpperCase()} />
            <DetailItem label="TIMELINE" value={proposal.timeline} />
            <DetailItem label="BUDGET" value={proposal.budget ? `IDR ${Number(proposal.budget).toLocaleString()}` : "-"} />
            <DetailItem label="FOLLOWERS" value={proposal.followers} />
            <DetailItem label="ENGAGEMENT" value={proposal.engagement ? `${proposal.engagement}%` : "-"} />
          </div>

          <div className="mt-8">
            <h3 className="text-xs font-black text-zinc-400 mb-2">CORE_CONCEPT</h3>
            <p className="bg-zinc-100 p-4 font-bold italic border-l-4 border-black">{proposal.core_concept}</p>
          </div>

          {/* ASSET LINKS */}
          <div className="mt-8 flex flex-wrap gap-4">
            {proposal.proposal_pdf_url && (
              <a href={proposal.proposal_pdf_url} target="_blank" rel="noreferrer" className="bg-black text-white px-6 py-3 text-[10px] font-black hover:bg-zinc-800">
                VIEW_PDF
              </a>
            )}
            {proposal.media_kit_url && (
              <a href={proposal.media_kit_url} target="_blank" rel="noreferrer" className="bg-[#f97316] text-black px-6 py-3 text-[10px] font-black hover:bg-orange-600">
                VIEW_MEDIA_KIT
              </a>
            )}
            {proposal.logo_asset_url && (
              <a href={proposal.logo_asset_url} target="_blank" rel="noreferrer" className="bg-zinc-200 text-black px-6 py-3 text-[10px] font-black hover:bg-zinc-300">
                VIEW_LOGO_ASSET
              </a>
            )}
            {proposal.works_url && (
              <a href={proposal.works_url} target="_blank" rel="noreferrer" className="border-2 border-black px-6 py-3 text-[10px] font-black hover:bg-black hover:text-white">
                VIEW_WORKS_URL
              </a>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="border-b-2 border-zinc-100 pb-2">
    <p className="text-[9px] font-black text-zinc-400">{label}</p>
    <p className="text-sm font-bold">{value || "-"}</p>
  </div>
);

export default ProposalDetail;
