const multer = require('multer');

// Gunakan memory storage agar file tidak tersimpan di folder lokal server
const storage = multer.memoryStorage();

// Filter file: Hanya izinkan format gambar
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('INVALID_FILE_TYPE: Only images are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Batas 5MB per file
  }
});

module.exports = upload;