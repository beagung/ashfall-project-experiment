const supabase = require("../config/supabase");

// Admin login dengan validasi role di tabel profiles
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Autentikasi email & password via Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) return res.status(401).json({ success: false, message: "Email atau password salah" });

    // 2. Verifikasi role admin pada tabel profiles
    const { data: profile, error: pError } = await supabase.from("profiles").select("role").eq("id_profiles", authData.user.id).single();
    if (pError || profile.role !== "admin") return res.status(403).json({ success: false, message: "Akses ditolak: Bukan admin" });

    res.status(200).json({ success: true, token: authData.session.access_token, role: profile.role });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Registrasi customer dan otomatis membuat profil di database
exports.registerCustomer = async (req, res) => {
  const { email, password, full_name } = req.body;
  try {
    // 1. Buat akun baru di Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password, options: { data: { role: "customer" } } });
    if (authError) return res.status(400).json({ success: false, message: authError.message });

    // 2. Sinkronisasi data ke tabel public.profiles
    if (authData?.user) {
      await supabase.from("profiles").insert([{ id_profiles: authData.user.id, full_name, email, role: "customer" }]);
    }
    res.status(200).json({ success: true, message: "Registrasi berhasil" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Customer login untuk akses fitur belanja
exports.loginCustomer = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) return res.status(401).json({ success: false, message: "Email/Password salah" });

    // Ambil detail profil untuk sesi user
    const { data: profile } = await supabase.from("profiles").select("id_profiles").eq("id_profiles", authData.user.id).single();
    res.status(200).json({ success: true, token: authData.session.access_token, user: { id: profile?.id_profiles, email } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Proses mengakhiri sesi user
exports.logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.status(200).json({ success: true, message: "Logout berhasil" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
