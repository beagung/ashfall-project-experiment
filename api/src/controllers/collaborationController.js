const supabase = require("../config/supabaseClient");

// GET ALL
exports.getAllCollaborations = async (req, res) => {
  try {
    const { data, error } = await supabase.from("collaborations").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET BY ID
exports.getCollaborationById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("collaborations").select("*").eq("id", id).single();
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE
exports.createCollaboration = async (req, res) => {
  try {
    const { name, description, instagram, type } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ error: "IMAGE_REQUIRED" });

    const filePath = `collaborations/${Date.now()}_${file.originalname}`;
    const { error: uploadError } = await supabase.storage.from("collaborations").upload(filePath, file.buffer, { contentType: file.mimetype });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage.from("collaborations").getPublicUrl(filePath);

    const { data, error: dbError } = await supabase
      .from("collaborations")
      .insert([{ name: name.toUpperCase(), description, instagram, type, image: publicUrlData.publicUrl }])
      .select();

    if (dbError) throw dbError;
    res.status(201).json({ message: "SUCCESS", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateCollaboration = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, instagram, type } = req.body;
    const file = req.file;

    let updateData = { name: name?.toUpperCase(), description, instagram, type };

    if (file) {
      const filePath = `collaborations/${Date.now()}_${file.originalname}`;
      const { error: uploadError } = await supabase.storage.from("collaborations").upload(filePath, file.buffer, { contentType: file.mimetype });
      if (uploadError) throw uploadError;
      const { data: publicUrlData } = supabase.storage.from("collaborations").getPublicUrl(filePath);
      updateData.image = publicUrlData.publicUrl;
    }

    const { data, error } = await supabase.from("collaborations").update(updateData).eq("id", id).select();
    if (error) throw error;
    res.status(200).json({ message: "SUCCESS_UPDATED", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
exports.deleteCollaboration = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("collaborations").delete().eq("id", id);
    if (error) throw error;
    res.status(200).json({ message: "DELETED" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
