import { supabase } from "../lib/supabaseClient";
import Home from "./home";
import "../app/globals.css";

export async function getStaticProps() {
  const { data, error } = await supabase
    .from("content")
    .select("*")
    .limit(1)
    .single();

  return {
    props: {
      initialContent: error ? null : data,
      revalidate: 1,
    },
  };
}


export default function IndexPage({ initialContent }) {
  return <Home initialContent={initialContent} />;
}
