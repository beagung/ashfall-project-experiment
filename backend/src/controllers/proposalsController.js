const supabase = require("../config/supabaseClient");

// 1. Submit Proposal: Mengunggah berkas kolaborasi ke Storage & menyimpan data pengajuan
exports.submitProposal = async (req, res) => {
  try {
    const { body, files } = req;
    const fileUrls = {};

    // Upload file ke Supabase Storage (Proposal PDF, Media Kit, Logo, dll)
    if (files) {
      for (const fieldName in files) {
        if (files[fieldName]?.length > 0) {
          const file = files[fieldName][0];
          const filePath = `submissions/${Date.now()}_${file.originalname.replace(/\s/g, "_")}`;

          await supabase.storage.from("proposals").upload(filePath, file.buffer, { contentType: file.mimetype });
          const { data } = supabase.storage.from("proposals").getPublicUrl(filePath);
          fileUrls[fieldName] = data.publicUrl;
        }
      }
    }

    // Insert metadata proposal ke tabel 'proposals'
    const { error } = await supabase.from("proposals").insert([
      {
        ...body,
        proposal_pdf_url: fileUrls["PROPOSAL_PDF"] || null,
        media_kit_url: fileUrls["MEDIA_KIT"] || null,
        logo_asset_url: fileUrls["LOGO_ASSET"] || null,
        works_url: fileUrls["WORKS"] || null,
        status: "pending",
      },
    ]);

    if (error) throw error;
    res.status(200).json({ success: true, message: "DATA_TRANSMITTED" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Read All Proposals: Mengambil seluruh histori pengajuan kolaborasi
exports.getAllProposals = async (req, res) => {
  try {
    const { data, error } = await supabase.from("proposals").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Read Proposal Detail: Mengambil detail pengajuan berdasarkan ID
exports.getProposalById = async (req, res) => {
  try {
    const { data, error } = await supabase.from("proposals").select("*").eq("id_proposal", req.params.id).single();
    if (error) throw error;
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Update Proposal Status: Mengubah status pengajuan (misal: 'approved'/'rejected')
exports.updateProposalStatus = async (req, res) => {
  try {
    const { error } = await supabase.from("proposals").update({ status: req.body.status }).eq("id_proposal", req.params.id);
    if (error) throw error;
    res.status(200).json({ success: true, message: `STATUS_UPDATED_TO_${req.body.status.toUpperCase()}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Delete Proposal: Menghapus data pengajuan yang tidak valid
exports.deleteProposal = async (req, res) => {
  try {
    const { error } = await supabase.from("proposals").delete().eq("id_proposal", req.params.id);
    if (error) throw error;
    res.status(200).json({ success: true, message: "ENTRY_DELETED" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
