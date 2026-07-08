const express = require("express");
const router = express.Router();
const multer = require("multer");
const controller = require("../controllers/storeController");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/", controller.getAllStores);
router.get("/:id", controller.getStoreById);
router.post("/", upload.single("image"), controller.createStore);
router.put("/:id", upload.single("image"), controller.updateStore);
router.delete("/:id", controller.deleteStore);

module.exports = router;
