require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://xzjyvtcevndzxsrmtoad.supabase.co';
// Use secret key for backend server operations, or publishable key if secret not provided
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_secret_A18jUPsj-Vl1u-UECzLa8A_TTkFYyhu';

let supabase = null;

try {
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  });
  console.log('✅ Supabase Client initialized with URL:', supabaseUrl);
} catch (err) {
  console.error('❌ Failed to initialize Supabase Client:', err.message);
}

module.exports = { supabase, supabaseUrl };
