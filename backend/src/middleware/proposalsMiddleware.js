const multer = require("multer");

// Gunakan memory storage agar file langsung diproses di buffer (tidak perlu simpan di disk)
const storage = multer.memoryStorage();

// Filter: Hanya izinkan Image (jpg/png) dan PDF
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("INVALID_FILE_TYPE: Only images and PDFs are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Maksimum 5MB per file
  },
});

/**
 * Middleware untuk menangani multi-field upload
 * Menangkap field spesifik dari FormData frontend
 */
const proposalUpload = upload.fields([
  { name: "PROPOSAL_PDF", maxCount: 1 },
  { name: "MEDIA_KIT", maxCount: 1 },
  { name: "LOGO_ASSET", maxCount: 1 },
  { name: "WORKS", maxCount: 1 },
]);

module.exports = proposalUpload;
