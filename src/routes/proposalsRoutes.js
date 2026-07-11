const express = require("express");
const router = express.Router();

// Import Middleware
// Pastikan middleware ini menangani field file (PROPOSAL_PDF, MEDIA_KIT, LOGO_ASSET, WORKS)
const proposalUpload = require("../middleware/proposalsMiddleware");

// Import Controller
const proposalsController = require("../controllers/proposalsController");

/**
 * @route   POST /api/proposals/submit
 * @desc    Submit proposal baru dengan file upload
 */
router.post("/submit", proposalUpload, proposalsController.submitProposal);

/**
 * @route   GET /api/proposals/
 * @desc    Ambil semua data proposal (Admin)
 */
router.get("/", proposalsController.getAllProposals);

/**
 * @route   GET /api/proposals/:id
 * @desc    Ambil detail satu proposal berdasarkan id_proposal
 */
router.get("/:id", proposalsController.getProposalById);

/**
 * @route   DELETE /api/proposals/:id
 * @desc    Hapus proposal berdasarkan id_proposal
 */
router.delete("/:id", proposalsController.deleteProposal);

/**
 * @route   PUT /api/proposals/status/:id
 * @desc    Update status proposal (pending/disetujui/ditolak)
 */
router.put("/status/:id", proposalsController.updateProposalStatus);

module.exports = router;
