/*
Supabase configuration

  1. Create a project at https://supabase.com/
  2. Copy your Project URL and anon/public key here.
  3. NEVER put your Supabase service_role key in this file.
*/
window.SUPABASE_URL = "https://ssrvucqpbxyenmzcylgc.supabase.co";
window.SUPABASE_ANON_KEY = "sb_publishable_6sxwOUoD69Ypan9i6htF9Q_5j8bQFh5";

window.SABA_CONFIGURED =
  window.SUPABASE_URL.startsWith("https://") &&
  !window.SUPABASE_URL.includes("YOUR_") &&
  !window.SUPABASE_ANON_KEY.includes("YOUR_");
