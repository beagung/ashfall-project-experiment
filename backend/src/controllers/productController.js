const supabase = require("../config/supabaseClient");

// 1. Create Product: Simpan data produk & upload gambar ke Supabase Storage
exports.createProduct = async (req, res) => {
  try {
    const { name, category_id, price, stock, description, sizes, discount, issue_id } = req.body;
    const files = req.files;

    // Upload gambar ke storage & dapatkan URL publik
    let imageUrls = [];
    if (files && files.length > 0) {
      for (const file of files) {
        const filePath = `products/${Date.now()}-${Math.random().toString(36).substring(7)}`;
        await supabase.storage.from("products").upload(filePath, file.buffer, { contentType: file.mimetype });
        const { data } = supabase.storage.from("products").getPublicUrl(filePath);
        imageUrls.push(data.publicUrl);
      }
    }

    // Parsing data JSON dan sanitasi input
    const payload = {
      name: name.toUpperCase().trim(),
      category_id: parseInt(category_id),
      price: parseFloat(price),
      stock: parseInt(stock) || 0,
      description: description || "-",
      sizes: typeof sizes === "string" ? JSON.parse(sizes) : sizes,
      discount: parseInt(discount) || 0,
      images: imageUrls,
      issue_id: parseInt(issue_id) > 0 ? parseInt(issue_id) : null,
    };

    const { data, error } = await supabase.from("products").insert([payload]).select();
    if (error) throw error;
    res.status(201).json({ success: true, data: data[0] });
  } catch (error) {
    res.status(500).json({ error: "DATABASE_ERROR", details: error.message });
  }
};

// 2. Read Product: Mengambil daftar semua produk beserta relasi data
exports.getAllProducts = async (req, res) => {
  try {
    const { data, error } = await supabase.from("products").select("*, issues(name), categories(name, slug)").order("created_at", { ascending: false });
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Read Product By ID: Detail satu produk
exports.getProductById = async (req, res) => {
  try {
    const { data, error } = await supabase.from("products").select("*, issues(*), categories(*)").eq("id_product", req.params.id).single();
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ error: "PRODUCT_NOT_FOUND" });
  }
};

// 4. Update Product: Pembaruan data produk & manajemen gambar
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category_id, price, stock, description, sizes, discount, issue_id, existingImages } = req.body;

    // Logika penggabungan gambar lama dan baru
    let finalImages = typeof existingImages === "string" ? JSON.parse(existingImages) : existingImages || [];
    if (req.files?.length > 0) {
      for (const file of req.files) {
        const filePath = `products/${Date.now()}-${Math.random().toString(36).substring(7)}`;
        await supabase.storage.from("products").upload(filePath, file.buffer);
        const { data } = supabase.storage.from("products").getPublicUrl(filePath);
        finalImages.push(data.publicUrl);
      }
    }

    const updateData = {
      name: name?.toUpperCase().trim(),
      price: price ? parseFloat(price) : undefined,
      stock: stock !== undefined ? parseInt(stock) : undefined,
      description,
      sizes: typeof sizes === "string" ? JSON.parse(sizes) : sizes,
      discount: parseInt(discount) || 0,
      images: finalImages,
      category_id: category_id ? parseInt(category_id) : undefined,
      issue_id: parseInt(issue_id) > 0 ? parseInt(issue_id) : null,
    };

    const { data, error } = await supabase.from("products").update(updateData).eq("id_product", id).select();
    if (error) throw error;
    res.status(200).json({ success: true, data: data[0] });
  } catch (error) {
    res.status(500).json({ error: "UPDATE_FAILED", details: error.message });
  }
};

// 5. Delete Product: Penghapusan data produk
exports.deleteProduct = async (req, res) => {
  try {
    const { error } = await supabase.from("products").delete().eq("id_product", req.params.id);
    if (error) throw error;
    res.status(200).json({ success: true, message: "PRODUCT_DELETED" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 6. Get All Issues: Helper untuk relasi kategori issue
exports.getAllIssues = async (req, res) => {
  try {
    const { data, error } = await supabase.from("issues").select("*").order("name", { ascending: true });
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
