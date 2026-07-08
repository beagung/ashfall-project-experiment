const supabase = require("../config/supabase");

/**
 * 1. GET ALL ENTRIES
 * Mengambil semua data dari tabel journals
 * (Order by dihapus karena kolom created_at tidak tersedia)
 */
const getEntries = async (req, res) => {
  try {
    const { data, error } = await supabase.from("journals").select("*");

    if (error) throw error;
    res.status(200).json(data || []);
  } catch (error) {
    console.error("GET_ENTRIES_ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * 2. GET SINGLE ENTRY
 * Mengambil satu data berdasarkan id_journal
 */
const getEntryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("journals").select("*").eq("id_journal", id).single();

    if (error || !data) return res.status(404).json({ error: "JOURNAL_NOT_FOUND" });
    res.status(200).json(data);
  } catch (error) {
    console.error("GET_ENTRY_BY_ID_ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * 3. CREATE ENTRY
 * Mengunggah file ke bucket dan menyimpan data ke tabel journals
 */
const createEntry = async (req, res) => {
  try {
    const { title, category, description, status } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "IMAGE_REQUIRED" });
    }

    const targetBucket = "journals";
    const fileExt = file.originalname.split(".").pop();
    const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;

    // Upload file ke Storage
    const { error: uploadError } = await supabase.storage.from(targetBucket).upload(fileName, file.buffer, {
      contentType: file.mimetype,
      duplex: "half",
      upsert: true,
    });

    if (uploadError) throw uploadError;

    // Ambil Public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(targetBucket).getPublicUrl(fileName);

    // Insert ke Database
    const { data, error: dbError } = await supabase
      .from("journals")
      .insert([
        {
          title: title?.toUpperCase() || "UNTITLED",
          category: (category || "GENERAL").toUpperCase(),
          description: description || "",
          image: publicUrl, // Menggunakan kolom 'image' sesuai skema
          status: status || "draft",
        },
      ])
      .select();

    if (dbError) throw dbError;

    res.status(201).json(data[0]);
  } catch (error) {
    console.error("CREATE_ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * 4. UPDATE ENTRY
 * Memperbarui data, opsional update image jika ada file baru
 */
const updateEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, description, status } = req.body;
    const file = req.file;

    let updateData = {
      title: title?.toUpperCase(),
      category: category?.toUpperCase(),
      description: description || "",
      status: status,
    };

    // Jika ada file baru, upload dan update kolom image
    if (file) {
      const targetBucket = "journals";
      const fileExt = file.originalname.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from(targetBucket).upload(fileName, file.buffer, {
        contentType: file.mimetype,
        duplex: "half",
        upsert: true,
      });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from(targetBucket).getPublicUrl(fileName);

      updateData.image = publicUrl;
    }

    const { data, error } = await supabase.from("journals").update(updateData).eq("id_journal", id).select();

    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ error: "ID_NOT_FOUND" });

    res.status(200).json(data[0]);
  } catch (error) {
    console.error("UPDATE_ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * 5. DELETE ENTRY
 * Menghapus data berdasarkan id_journal
 */
const deleteEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("journals").delete().eq("id_journal", id);

    if (error) throw error;
    res.status(200).json({ message: "ENTRY_DELETED_SUCCESSFULLY" });
  } catch (error) {
    console.error("DELETE_ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createEntry,
  getEntries,
  getEntryById,
  updateEntry,
  deleteEntry,
};
