const express = require("express");
const router = express.Router();
const journalController = require("../controllers/journalController"); // Gunakan cara ini agar lebih aman
const { protect } = require("../middleware/authMiddleware");
const journalMulter = require("../middleware/journalMulter");

// Gunakan journalController.namaFungsi untuk menghindari 'undefined' crash
router.get("/", journalController.getEntries);
router.get("/:id", journalController.getEntryById);
router.post("/", protect, journalMulter.single("image"), journalController.createEntry);
router.put("/:id", protect, journalMulter.single("image"), journalController.updateEntry);
router.delete("/:id", protect, journalController.deleteEntry);

module.exports = router;
