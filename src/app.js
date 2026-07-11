const express = require("express");
const cors = require("cors");
const multer = require("multer");

// PATH DIUBAH: Menggunakan ./ karena routes berada dalam satu folder src/ dengan app.js
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const journalRoutes = require("./routes/journalRoutes");
const contactRoutes = require("./routes/contactRoutes");
const issueRoutes = require("./routes/issueRoutes");
const collaborationRoutes = require("./routes/collaborationRoutes");
const storeRoutes = require("./routes/storeRoutes");
const orderRoutes = require("./routes/orderRoutes");
const proposalsRoutes = require("./routes/proposalsRoutes");
const profileRoutes = require("./routes/profileRoutes");

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

/**
 * Global Error Handler
 */
app.use((err, req, res, next) => {
  console.error("❌ GLOBAL_ERROR_HANDLER:", err.stack);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: `UPLOAD_ERROR: ${err.message}`,
    });
  }

  if (err.message && err.message.includes("INVALID_FILE_TYPE")) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  res.status(500).json({
    success: false,
    message: err.message || "INTERNAL_SERVER_ERROR",
  });
});

module.exports = app;
