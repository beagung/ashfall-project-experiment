const express = require("express");
const router = express.Router();
const { sendContactMessage, getAllMessages, getMessageById, deleteMessage } = require("../controllers/contactController");

// Import middleware protect
const { protect } = require("../middleware/authMiddleware");

// 1. POST: Harus LOGIN untuk kirim pesan (Gunakan middleware protect)
router.post("/", protect, sendContactMessage);

// 2. GET (Semua) & GET (Detail) & DELETE:
// Biasanya hanya untuk ADMIN, Anda bisa tambahkan middleware 'admin' jika ada
router.get("/", getAllMessages);
router.get("/:id", getMessageById);
router.delete("/:id", deleteMessage);

module.exports = router;
