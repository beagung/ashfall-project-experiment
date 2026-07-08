const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// --- PUBLIC & PAYMENT GATEWAY ROUTES ---
router.post("/create-transaction", orderController.createTransaction);
router.post("/webhook", orderController.handleWebhook);

// Rute untuk riwayat belanja berdasarkan EMAIL
router.get("/user-history/:email", orderController.getUserOrdersByEmail);

// Rute untuk mengambil detail profil pelanggan (untuk halaman CustomerProfile)
router.get("/customer-profile/:email", orderController.getCustomerProfile);

// Rute untuk riwayat belanja berdasarkan USER ID
router.get("/user/:userId", orderController.getUserOrders);

// --- MANAGEMENT / ADMIN ROUTES ---
router.get("/admin/all", orderController.getAllOrders);
router.get("/admin/detail/:id_order", orderController.getOrderDetail);
router.put("/admin/update/:id_order", orderController.updateOrderStatus);
router.delete("/admin/delete/:id_order", orderController.deleteOrder);

// Rute untuk statistik pelanggan (Top Buyers)
router.get("/admin/customer-stats", orderController.getCustomerStats);

module.exports = router;
