// Memuat variabel environment dari file .env
require("dotenv").config();

// Mengimpor aplikasi Express yang sudah dikonfigurasi di src/app.js
const app = require("../src/app");

// Mengekspor app agar Vercel bisa menjalankan fungsi Serverless-nya
module.exports = app;
