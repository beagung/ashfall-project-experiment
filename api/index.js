require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");

// PATH DIUBAH: Karena src ada di dalam api, maka pakai ./src/...
const authRoutes = require("./src/routes/authRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const productRoutes = require("./src/routes/productRoutes");
const journalRoutes = require("./src/routes/journalRoutes");
const contactRoutes = require("./src/routes/contactRoutes");
const issueRoutes = require("./src/routes/issueRoutes");
const collaborationRoutes = require("./src/routes/collaborationRoutes");
const storeRoutes = require("./src/routes/storeRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const proposalsRoutes = require("./src/routes/proposalsRoutes");
const profileRoutes = require("./src/routes/profileRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/collaborations", collaborationRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/proposals", proposalsRoutes);
app.use("/api/profiles", profileRoutes);

app.get("/", (req, res) => res.send("ASHFALL_CORE_API_ACTIVE"));

// Error Handler
app.use((err, req, res, next) => {
  console.error("❌ GLOBAL_ERROR_HANDLER:", err.stack);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: `UPLOAD_ERROR: ${err.message}` });
  }
  res.status(500).json({ success: false, message: err.message || "INTERNAL_SERVER_ERROR" });
});

// EKSPOR UNTUK VERCEL
module.exports = app;
