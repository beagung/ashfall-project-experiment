const express = require('express');
const router = express.Router();
const multer = require('multer');
const issueController = require('../controllers/issueController');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/', issueController.getAllIssues);
// Tambahkan route ini agar GET /api/issues/:id tidak 404
router.get('/:id', issueController.getIssueById); 
router.post('/', upload.single('image'), issueController.createIssue);
router.put('/:id', upload.single('image'), issueController.updateIssue);
router.delete('/:id', issueController.deleteIssue);

module.exports = router;