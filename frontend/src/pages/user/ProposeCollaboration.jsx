import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import backgroundCollab from "../../assets/img/backgroundshop.png";

// Komponen UI modular untuk kerapian kode
const SectionTitle = ({ number, title }) => (
  <h2 className="text-2xl font-black italic mb-6 bg-black text-white px-3 py-1 inline-block uppercase tracking-tighter">
    {number}_{title}
  </h2>
);

const CompactInput = ({ label, name, type = "text", placeholder, rows, required, onChange }) => (
  <div className="flex flex-col gap-1 mb-4">
    <label className="text-[10px] font-black italic text-zinc-500 uppercase">
      {label}_ {required && "*"}
    </label>
    {rows ? (
      <textarea name={name} rows={rows} required={required} onChange={onChange} className="w-full bg-white border-2 border-black p-3 shadow-[4px_4px_0px_#000] outline-none font-bold text-sm" />
    ) : (
      <input name={name} type={type} placeholder={placeholder} required={required} onChange={onChange} className="w-full bg-white border-2 border-black p-3 shadow-[4px_4px_0px_#000] outline-none font-bold text-sm" />
    )}
  </div>
);

const FileUploadBox = ({ fieldName, file, refs, onChange }) => (
  <div onClick={() => refs[fieldName].current.click()} className={`border-2 border-dashed p-4 flex flex-col items-center justify-center min-h-[100px] cursor-pointer ${file ? "border-[#f97316] bg-orange-50" : "border-zinc-400"}`}>
    <input type="file" ref={refs[fieldName]} className="hidden" onChange={(e) => onChange(e, fieldName)} />
    <CloudUploadIcon className={file ? "text-[#f97316]" : "text-zinc-300"} />
    <span className="text-[8px] font-black mt-2 uppercase">{file ? file.name : fieldName.replace("_", " ")}</span>
  </div>
);

const ProposeCollaboration = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({ PROPOSAL_PDF: null, MEDIA_KIT: null, LOGO_ASSET: null, WORKS: null });

  const fileInputRefs = {
    PROPOSAL_PDF: useRef(null),
    MEDIA_KIT: useRef(null),
    LOGO_ASSET: useRef(null),
    WORKS: useRef(null),
  };

  const collabOptions = ["Brand Collaboration", "Band Merch", "Creative Project", "Content Collab"];

  // 1. Handle Submission: Mengirim proposal ke server dengan multi-part data
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return alert("LOGIN_REQUIRED.");
    if (!selectedType) return alert("PLEASE_SELECT_COLLAB_TYPE.");

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    formData.append("user_id", user.id);
    formData.append("collab_type", selectedType);

    // Append file ke dalam FormData
    Object.keys(uploadedFiles).forEach((key) => {
      if (uploadedFiles[key]) formData.append(key, uploadedFiles[key]);
    });

    try {
      await axios.post("http://localhost:5000/api/proposals/submit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("PROPOSAL_SUBMITTED_SUCCESSFULLY.");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "SUBMISSION_FAILED.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-10 bg-zinc-100" style={{ backgroundImage: `url(${backgroundCollab})` }}>
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto bg-white p-10 border-4 border-black shadow-[15px_15px_0px_#f97316]">
        <h1 className="text-5xl font-black mb-10">
          PROPOSAL_HUB<span className="text-[#f97316]">.</span>
        </h1>

        {/* ... (Isi formulir menggunakan komponen di atas) */}
        <button type="submit" disabled={isSubmitting} className="w-full bg-[#f97316] text-black p-6 mt-10 font-black text-xl hover:translate-x-1 hover:translate-y-1 transition-all">
          {isSubmitting ? "TRANSMITTING..." : "SUBMIT_PROPOSAL"}
        </button>
      </form>
    </div>
  );
};

export default ProposeCollaboration;
