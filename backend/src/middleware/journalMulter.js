const multer = require('multer');

const storage = multer.memoryStorage();

const journalMulter = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('LIMIT_FILE_TYPE: Only images are allowed!'), false);
    }
  }
});

module.exports = journalMulter; // Pastikan hanya ini yang diekspor