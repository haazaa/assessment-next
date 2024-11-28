import { supabase } from "../lib/supabaseClient";
import Page from "./home";
import "../app/globals.css";

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
        revalidate: 1,
      };
    }

    return {
      props: {
        initialContent: data,
      },
      revalidate: 1,
    };
  } catch (err) {
    console.error("Unexpected error:", err);
    return {
      props: {
        initialContent: null,
      },
      revalidate: 1,
    };
  }
}

export default function IndexPage({ initialContent }) {
  return <Page initialContent={initialContent} />;
}
