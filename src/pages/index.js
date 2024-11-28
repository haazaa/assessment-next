import { supabase } from "../lib/supabaseClient";
import Page from "./home";
import "../app/globals.css";
// Fetch data at build time
export async function getStaticProps() {
  try {
    const { data, error } = await supabase
      .from("content")
      .select("*")
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching initial content:", error.message);
      return {
        props: {
          initialContent: null,
        },
        revalidate: 10, // Regenerate the page every 10 seconds
      };
    }

    return {
      props: {
        initialContent: data,
      },
      revalidate: 10, // Regenerate the page every 10 seconds
    };
  } catch (err) {
    console.error("Unexpected error:", err);
    return {
      props: {
        initialContent: null,
      },
      revalidate: 10,
    };
  }
}

export default function IndexPage({ initialContent }) {
  return <Page initialContent={initialContent} />;
}
