require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://xzjyvtcevndzxsrmtoad.supabase.co';
// Use working publishable key or secret key
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_SECRET_KEY || 'sb_publishable_kNXx11mJ2eVv4PBYrlPLfQ_jpTrkkes';

let supabase = null;

try {
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  });
  console.log('✅ Supabase Client initialized with URL:', supabaseUrl);
  console.log('🔑 Using Supabase key prefix:', supabaseKey.substring(0, 15) + '...');
} catch (err) {
  console.error('❌ Failed to initialize Supabase Client:', err.message);
}

module.exports = { supabase, supabaseUrl };
