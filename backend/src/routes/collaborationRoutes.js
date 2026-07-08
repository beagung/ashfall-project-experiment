const express = require("express");
const router = express.Router();
const multer = require("multer");
const controller = require("../controllers/collaborationController");
const { protect } = require("../middleware/authMiddleware"); // Impor middleware Anda

const upload = multer({ storage: multer.memoryStorage() });

// Rute Publik (Semua orang bisa akses)
router.get("/", controller.getAllCollaborations);
router.get("/:id", controller.getCollaborationById);

// Rute Terproteksi (Hanya Member/User dengan Token)
router.post("/", protect, upload.single("image"), controller.createCollaboration);
router.put("/:id", protect, upload.single("image"), controller.updateCollaboration);
router.delete("/:id", protect, controller.deleteCollaboration);

module.exports = router;
