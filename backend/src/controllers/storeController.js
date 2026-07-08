const supabase = require("../config/supabase");

// GET ALL
exports.getAllStores = async (req, res) => {
  try {
    const { data, error } = await supabase.from("stores").select("*").order("created_at", { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    console.error("GET_ALL_ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET BY ID (Diubah menggunakan id_store)
exports.getStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .eq("id_store", id) // <--- PERUBAHAN DI SINI
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    console.error("GET_BY_ID_ERROR:", err);
    res.status(404).json({ error: "Store not found" });
  }
};

// CREATE (Tetap sama, karena id_store biasanya auto-increment)
exports.createStore = async (req, res) => {
  try {
    const { name, description, address } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: "IMAGE_REQUIRED" });

    const fileExt = file.originalname.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `images/${fileName}`;

    const { error: uploadError } = await supabase.storage.from("stores").upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage.from("stores").getPublicUrl(filePath);

    const { data, error: dbError } = await supabase.from("stores").insert([
      {
        name: name ? name.toUpperCase() : "UNTITLED",
        description: description || "",
        address: address || "",
        image: publicUrlData.publicUrl,
      },
    ]);

    if (dbError) throw dbError;
    res.status(201).json({ message: "SUCCESS", data });
  } catch (err) {
    console.error("CREATE_STORE_ERROR_DETAIL:", err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE (Diubah menggunakan id_store)
exports.updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, address } = req.body;
    const file = req.file;

    let updateData = {};
    if (name) updateData.name = name.toUpperCase();
    if (description !== undefined) updateData.description = description;
    if (address !== undefined) updateData.address = address;

    if (file) {
      const fileExt = file.originalname.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `images/${fileName}`;

      const { error: uploadError } = await supabase.storage.from("stores").upload(filePath, file.buffer, { contentType: file.mimetype });
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from("stores").getPublicUrl(filePath);
      updateData.image = publicUrlData.publicUrl;
    }

    const { data, error } = await supabase.from("stores").update(updateData).eq("id_store", id); // <--- PERUBAHAN DI SINI

    if (error) throw error;
    res.status(200).json({ message: "SUCCESS_UPDATED", data });
  } catch (err) {
    console.error("UPDATE_STORE_ERROR_DETAIL:", err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE (Diubah menggunakan id_store)
exports.deleteStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("stores").delete().eq("id_store", id); // <--- PERUBAHAN DI SINI

    if (error) throw error;
    res.status(200).json({ message: "DELETED" });
  } catch (err) {
    console.error("DELETE_STORE_ERROR_DETAIL:", err);
    res.status(500).json({ error: err.message });
  }
};
