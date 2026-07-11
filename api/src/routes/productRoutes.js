const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/uploadMiddleware');

// Route mendapatkan semua produk
router.get('/', productController.getAllProducts);

// Route mendapatkan satu produk (untuk form edit)
router.get('/:id', productController.getProductById);

// Route tambah produk
router.post('/', upload.array('images', 5), productController.createProduct);

// Route update produk
router.put('/:id', upload.array('images', 5), productController.updateProduct);

// Route hapus produk
router.delete('/:id', productController.deleteProduct);

// Di file routes/productRoutes.js
router.get('/issues', productController.getAllIssues);

module.exports = router;