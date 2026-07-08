const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Mengambil file .env dari root folder
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log("❌ CRITICAL: Supabase URL/Key is missing in .env");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;