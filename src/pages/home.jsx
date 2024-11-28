"use client";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";
import Head from "next/head";

export default function Home({ initialContent }) {
  const [content, setContent] = useState(initialContent);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .limit(1)
        .single();
      if (error) throw error;

      if (JSON.stringify(data) !== JSON.stringify(content)) {
        setContent(data);
      }
    } catch (err) {
      console.log("🚀 ~ fetchContent ~ err:", err);
    }
  };

  useEffect(() => {
    if (!content || content?.updated_at !== initialContent?.updated_at) {
      fetchContent();
    }

    if (typeof window !== "undefined") {
      const subscription = supabase
        .channel("content-changes")
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "content" },
          fetchContent
        )
        .subscribe();

      return () => supabase.removeChannel(subscription);
    }
  }, [initialContent, content]);

  const Title = content?.title || "Loading...";
  const Description = content?.description || "Loading content...";

  const renderContent = () => (
    <div>
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold capitalize font-serif mb-4">
        {Title}
      </h1>
      <p className="text-xl sm:text-2xl md:text-3xl font-light font-serif whitespace-pre-line">
        {Description}
      </p>
    </div>
  );

  return (
    <div className="mx-[5%] sm:mx-[10%] my-[5%]">
      <Head>
        <title>{Title}</title>
        <meta name="description" content={Description} />
        <meta name="keywords" content="React, Next.js, Supabase, SEO" />
        <meta property="og:title" content={Title || "Loading..."} />
        <meta property="og:description" content={Description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://assessment-next.vercel.app/" />
        <meta name="robots" content="index, follow" />
      </Head>
      {content && renderContent()}
    </div>
  );
}
