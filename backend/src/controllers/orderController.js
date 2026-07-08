const midtransClient = require("midtrans-client");
const supabase = require("../config/supabaseClient");

let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

// 1. Create Transaction: Simpan order & generate Snap Token Midtrans
exports.createTransaction = async (req, res) => {
  try {
    const { name, email, phone, address, province, city, district, cartItems, user_id } = req.body;
    const finalUserId = user_id && user_id !== "null" ? user_id : null;
    const orderId = `ASHFALL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Kalkulasi total harga setelah diskon
    const trueGrossAmount = cartItems.reduce((sum, item) => {
      const p = Number(item.price) || 0;
      const d = Number(item.discount) || 0;
      return sum + Math.floor(p * (1 - d / 100)) * Number(item.quantity);
    }, 0);

    // Insert data pesanan ke database
    const { data: newOrder, error: orderError } = await supabase
      .from("orders")
      .insert([{ order_id: orderId, customer_name: name, email, phone, address, province, city, district, total_amount: trueGrossAmount, status: "pending", user_id: finalUserId }])
      .select("id_order")
      .single();

    if (orderError) throw new Error(orderError.message);

    // Simpan detail item ke database
    const orderItemsPayload = cartItems.map((item) => ({
      order_id: newOrder.id_order,
      product_id: Number(item.id || item.id_product),
      quantity: Number(item.quantity),
      size: String(item.selectedSize || item.size || "N/A"),
      price: Math.floor(Number(item.price) * (1 - (Number(item.discount) || 0) / 100)),
    }));

    await supabase.from("order_items").insert(orderItemsPayload);

    // Integrasi Midtrans Snap
    const transaction = await snap.createTransaction({
      transaction_details: { order_id: orderId, gross_amount: trueGrossAmount },
      customer_details: { first_name: name, email, phone },
    });

    res.status(201).json({ token: transaction.token, order_id: orderId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Midtrans Webhook: Update status order & update stok produk otomatis
exports.handleWebhook = async (req, res) => {
  try {
    const { order_id, transaction_status } = req.body;
    const targetStatus = ["settlement", "capture"].includes(transaction_status) ? "success" : "failed";
    await supabase.from("orders").update({ status: targetStatus }).eq("order_id", order_id);

    // Jika pembayaran sukses, kurangi stok produk
    if (targetStatus === "success") {
      const { data: order } = await supabase.from("orders").select("id_order").eq("order_id", order_id).single();
      const { data: items } = await supabase.from("order_items").select("product_id, quantity, size").eq("order_id", order.id_order);

      for (const item of items) {
        const { data: product } = await supabase.from("products").select("sizes").eq("id_product", item.product_id).single();
        if (product?.sizes) {
          let s = typeof product.sizes === "string" ? JSON.parse(product.sizes) : product.sizes;
          if (s[item.size] !== undefined) {
            s[item.size] = Math.max(0, s[item.size] - item.quantity);
            await supabase.from("products").update({ sizes: s }).eq("id_product", item.product_id);
          }
        }
      }
    }
    res.status(200).send("OK");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Admin: Ambil semua data pesanan
exports.getAllOrders = async (req, res) => {
  const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  res.status(200).json(data);
};

// 4. Admin: Update status pesanan
exports.updateOrderStatus = async (req, res) => {
  await supabase.from("orders").update({ status: req.body.status }).eq("id_order", req.params.id_order);
  res.status(200).json({ message: "Status Updated" });
};

// 5. Admin: Hapus pesanan
exports.deleteOrder = async (req, res) => {
  await supabase.from("orders").delete().eq("id_order", req.params.id_order);
  res.status(200).json({ message: "Deleted" });
};

// 6. Admin: Ambil detail pesanan
exports.getOrderDetail = async (req, res) => {
  const { data } = await supabase.from("orders").select(`*, order_items (quantity, size, price, products (name, images))`).eq("id_order", req.params.id_order).single();
  res.status(200).json(data);
};

// 7. Ambil pesanan user berdasarkan email
exports.getUserOrdersByEmail = async (req, res) => {
  try {
    const { data } = await supabase.from("orders").select(`*, order_items (product_id, quantity, size, price)`).ilike("email", req.params.email).order("created_at", { ascending: false });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 8. Ambil pesanan user berdasarkan user_id
exports.getUserOrders = async (req, res) => {
  try {
    const { data } = await supabase.from("orders").select(`*, order_items (quantity, size, price, product_id)`).eq("user_id", req.params.userId).order("created_at", { ascending: false });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 9. Statistik pelanggan berdasarkan total belanja
exports.getCustomerStats = async (req, res) => {
  try {
    const { data } = await supabase.from("orders").select("customer_name, email, total_amount, user_id").not("user_id", "is", null);
    const stats = data.reduce((acc, order) => {
      const email = order.email.toLowerCase();
      if (!acc[email]) acc[email] = { customer_name: order.customer_name, email: email, total_orders: 0, total_spent: 0 };
      acc[email].total_orders += 1;
      acc[email].total_spent += Number(order.total_amount);
      return acc;
    }, {});
    res.status(200).json(Object.values(stats).sort((a, b) => b.total_orders - a.total_orders));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 10. Ambil profil pelanggan
exports.getCustomerProfile = async (req, res) => {
  try {
    const { data, error } = await supabase.from("users").select("*").eq("email", req.params.email).single();
    if (error) {
      const { data: orderData } = await supabase.from("orders").select("customer_name, phone, address, province, city, district").ilike("email", req.params.email).order("created_at", { ascending: false }).limit(1).single();
      return res.status(200).json(orderData || { customer_name: "Customer", email: req.params.email });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
