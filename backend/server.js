require("dotenv").config();
// 1. Impor app DULU
const app = require("./src/app");

// 2. Sekarang Anda bisa menambahkan route ATAU
// tambahkan route di dalam file ./src/app.js
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SERVER_RUNNING: http://localhost:${PORT}`);
});
