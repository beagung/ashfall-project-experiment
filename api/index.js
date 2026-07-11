require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");

// PATH DIUBAH: Gunakan "../" agar keluar dari folder api/ menuju ke root/src/
const authRoutes = require("../src/routes/authRoutes");
const categoryRoutes = require("../src/routes/categoryRoutes");
const productRoutes = require("../src/routes/productRoutes");
const journalRoutes = require("../src/routes/journalRoutes");
const contactRoutes = require("../src/routes/contactRoutes");
const issueRoutes = require("../src/routes/issueRoutes");
const collaborationRoutes = require("../src/routes/collaborationRoutes");
const storeRoutes = require("../src/routes/storeRoutes");
const orderRoutes = require("../src/routes/orderRoutes");
const proposalsRoutes = require("../src/routes/proposalsRoutes");
const profileRoutes = require("../src/routes/profileRoutes");

const app = express();

// ... (sisanya sama, tidak perlu diubah)
