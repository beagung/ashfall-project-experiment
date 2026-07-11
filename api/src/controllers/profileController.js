const supabase = require("../config/supabase");

// 1. GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("profiles").select("*").eq("id_profiles", id).single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ error: "PROFILE_NOT_FOUND" });
  }
};

// 2. UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, phone, address, province, city, district, avatar_url } = req.body;
    const file = req.file; // Middleware uploadMiddleware menyediakan ini

    let finalAvatarUrl = avatar_url;

    // Jika ada file baru, upload ke Supabase Storage
    if (file) {
      const fileExt = file.originalname.split(".").pop();
      const fileName = `avatars/${id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(fileName);

      finalAvatarUrl = publicUrlData.publicUrl;
    }

    // Update ke database
    const updateData = {
      full_name: full_name ? full_name.toUpperCase() : undefined,
      email: email,
      // PERBAIKAN: Menggunakan .toString() karena tipe data di database adalah VARCHAR / String
      phone: phone && phone !== "" && phone !== "null" ? phone.toString() : null,
      address,
      province,
      city,
      district,
      avatar_url: finalAvatarUrl,
    };

    const { data, error: dbError } = await supabase.from("profiles").update(updateData).eq("id_profiles", id).select();

    if (dbError) throw dbError;

    // Pastikan data ada sebelum mengambil indeks ke-0
    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, error: "PROFILE_NOT_FOUND" });
    }

    res.status(200).json({ success: true, data: data[0] });
  } catch (error) {
    console.error("DEBUG ERROR:", error);
    res.status(500).json({ error: "UPDATE_FAILED", details: error.message });
  }
};
