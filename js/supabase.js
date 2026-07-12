const SUPABASE_URL = "https://oceikxdqjgkewwziaabj.supabase.co/rest/v1/";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jZWlreGRxamdrZXd3emlhYWJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4NzQyODIsImV4cCI6MjA5OTQ1MDI4Mn0.8hEgQZupDGoNP2I14JbkgelT6TaeRWq7SwDxRgQ7UNw";


const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
