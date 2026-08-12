// ==========================================
// RÍO CRISTALINO
// CONEXIÓN CON SUPABASE
// ==========================================

const SUPABASE_URL =
    "https://sapixsrdfabaqrcegvsn.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_DCQ8ejhc1TUf4dOqz79PDg_MEyQoiNi";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

console.log("RÍO CRISTALINO: Supabase conectado");