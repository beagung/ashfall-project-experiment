const supabase = require("../config/supabaseClient");

// Mendapatkan semua kategori
exports.getCategories = async (req, res) => {
  // 1. Sesuaikan nama tabel ke 'categories' dan pengurutan berdasarkan 'id_category'
  const { data, error } = await supabase.from("categories").select("*").order("id_category", { ascending: true });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// Membuat kategori baru
exports.createCategory = async (req, res) => {
  const { name, slug } = req.body;

  // 2. Sesuaikan nama tabel ke 'categories'
  const { data, error } = await supabase
    .from("categories")
    .insert([{ name, slug, count: 0 }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data[0]);
};

// Memperbarui kategori berdasarkan ID
exports.updateCategory = async (req, res) => {
  const { id } = req.params; // Mengambil parameter dari URL rute (misal: /api/categories/:id)
  const { name, slug } = req.body;

  // 3. Sesuaikan nama tabel ke 'categories' dan klausa pencarian ke 'id_category'
  const { data, error } = await supabase.from("categories").update({ name, slug }).eq("id_category", id).select();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
};

// Menghapus kategori berdasarkan ID
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  // 4. Sesuaikan nama tabel ke 'categories' dan klausa penghapusan ke 'id_category'
  const { error } = await supabase.from("categories").delete().eq("id_category", id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Category deleted successfully" });
};
