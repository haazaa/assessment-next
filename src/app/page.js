import { supabase } from "../lib/supabaseClient";
import Home from "./home";

// Server Component fetching initial static content
async function fetchInitialContent() {
  const { data, error } = await supabase.from("content").select("*").single();
  if (error) throw new Error("Failed to fetch initial content.");
  return data;
}

export default async function Page() {
  let initialContent;
  try {
    initialContent = await fetchInitialContent();
  } catch (error) {
    initialContent = null;
  }

  return <Home initialContent={initialContent} />;
}
