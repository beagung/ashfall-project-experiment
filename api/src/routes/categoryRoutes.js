const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Rute ini akan otomatis menggunakan tabel 'category' (tunggal) 
// karena logic di dalam controllernya sudah kita sesuaikan.
router.get('/', categoryController.getCategories);
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;