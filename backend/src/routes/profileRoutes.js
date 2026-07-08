const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const upload = require('../middleware/uploadMiddleware');

// Route untuk mendapatkan profil
router.get('/:id', profileController.getProfile);

// Route untuk update profil (termasuk upload avatar)
// Kita menggunakan .single('avatar') karena profil hanya butuh 1 foto
router.put('/:id', upload.single('avatar'), profileController.updateProfile);

module.exports = router;