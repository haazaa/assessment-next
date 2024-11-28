import { supabase } from "../lib/supabaseClient";
import Home from "./home";

async function fetchInitialContent() {
  const { data, error } = await supabase
    .from("content")
    .select("*")
    .limit(1)
    .single();
  if (error) {
    console.error("Error fetching initial content:", error.message);
    return null;
  }
  return data;
}
export const revalidate = 0;

export default async function Page() {
  let initialContent;
  try {
    initialContent = await fetchInitialContent();
  } catch (error) {
    console.error("Error fetching initial content:", error);
    initialContent = null;
  }

  return <Home initialContent={initialContent} />;
}
