/**
 * NAVITO — Supabase Client Initialization
 * Replaces Firebase. Exposes window.supabase for use across all pages.
 */

const SUPABASE_URL = 'https://yfjmzjsibbogfilbpfir.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlmam16anNpYmJvZ2ZpbGJwZmlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMzI5NzQsImV4cCI6MjA5MzkwODk3NH0.lsfC653oKuHy2RW0its5bwNPobUxU96xDWAiPBB-WLE';

// Initialize and expose the Supabase client globally
window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('✅ Supabase client initialized');
