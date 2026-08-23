// ============================================================
// SUPABASE - VAIDTÁXI
// ============================================================

// Configuração do projeto Supabase

const SUPABASE_URL = "https://lwgdryiyksopjsyqfowz.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3Z2RyeWl5a3NvcGpzeXFmb3d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MTE0NzAsImV4cCI6MjEwMjE4NzQ3MH0.7oINUZaLEOGGwj6GXB0Sb89BwYK4i9_itV_M4f70Rws";

// ============================================================
// CLIENTE SUPABASE
// ============================================================

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
