const supabase = require("../config/supabase");

const protect = async (req, res, next) => {
  let token;

  // 1. Ambil token dari header Authorization
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "UNAUTHORIZED_ACCESS" });
  }

  try {
    // 2. Verifikasi token ke Supabase Auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ success: false, message: "INVALID_OR_EXPIRED_TOKEN" });
    }

    // 3. Query tambahan ke tabel 'profiles'
    // Menggunakan id_profiles karena itu Primary Key di tabel profiles Anda
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id_profiles, full_name, email, role")
      .eq("id_profiles", user.id) // Mencocokkan ID Auth dengan kolom Primary Key profiles
      .single();

    if (profileError || !profile) {
      console.error("DEBUG - Profile Query Error:", profileError);
      return res.status(404).json({
        success: false,
        message: "USER_PROFILE_NOT_FOUND",
        details: profileError ? profileError.message : "Profile data is empty",
      });
    }

    // 4. Gabungkan data ke dalam req.user
    // Kita simpan id_profiles sebagai referensi utama untuk relasi ke tabel lain
    req.user = {
      ...user,
      ...profile,
    };

    return next();
  } catch (error) {
    console.error("AUTH_MIDDLEWARE_ERROR:", error);
    res.status(500).json({ success: false, message: "SERVER_ERROR_IN_AUTH" });
  }
};

module.exports = { protect };
