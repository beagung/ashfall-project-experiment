const supabase = require("../config/supabaseClient");

// 1. Kirim Pesan (POST)
const sendContactMessage = async (req, res) => {
  try {
    const { id_profiles, full_name, email } = req.user;
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ success: false, message: "SUBJECT_AND_MESSAGE_REQUIRED" });
    }

    const { data, error } = await supabase
      .from("contact_messages")
      .insert([
        {
          user_id: id_profiles,
          full_name,
          email,
          subject,
          message,
        },
      ])
      .select();

    if (error) {
      console.error("POST_ERROR:", error);
      throw error;
    }
    res.status(201).json({ success: true, data: data[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Ambil Semua Pesan (GET) - Menggunakan fallback jika relasi bermasalah
const getAllMessages = async (req, res) => {
  try {
    // Kita coba select dengan relasi, jika error/kosong, kita tetap ambil datanya
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*") // Ubah sementara ke * untuk memastikan data muncul
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GET_ALL_ERROR:", error);
      throw error;
    }

    // Log data untuk memastikan backend menerima data dari Supabase
    console.log("DATA_DITERIMA_BACKEND:", data);

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Ambil Detail Pesan (GET BY ID)
const getMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("contact_messages").select("*").eq("id_message", id).single();

    if (error) throw error;
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Hapus Pesan (DELETE)
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("contact_messages").delete().eq("id_message", id);

    if (error) throw error;
    res.status(200).json({ success: true, message: "PURGED_SUCCESSFULLY" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  sendContactMessage,
  getAllMessages,
  getMessageById,
  deleteMessage,
};
