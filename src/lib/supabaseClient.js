import { createClient } from "@supabase/supabase-js";
const supabaseURL = "https://aeyjtpnvqzyewgtlexaa.supabase.co";
const subabaseAPIkey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFleWp0cG52cXp5ZXdndGxleGFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2MjA2NTAsImV4cCI6MjA0ODE5NjY1MH0.W7g_gcGbeGiAwGQrJjWVstUKnPJ4Fm6wuosDOIv9aWI";

if (!supabaseURL || !subabaseAPIkey) {
  throw new Error("Missing Supabase URL or Anon Key environment variables");
}

export const supabase = createClient(supabaseURL, subabaseAPIkey);
