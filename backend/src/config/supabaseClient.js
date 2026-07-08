const { createClient } = require("@supabase/supabase-js");
const path = require("path");

// Memaksa dotenv mencari file .env di folder root (naik 2 level dari src/config)
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Log untuk memastikan kunci terbaca sebelum client dibuat
if (!supabaseKey) {
  console.log("❌ CRITICAL ERROR: Kunci API tidak terbaca!");
} else {
  console.log("✅ SUCCESS: Supabase Key Detected.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
