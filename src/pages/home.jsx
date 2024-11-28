// /pages/index.js
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
    if (!content || content.updated_at !== initialContent?.updated_at) {
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

  const renderContent = () => (
    <div>
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold capitalize font-serif mb-4">
        {content.title}
      </h1>
      <p className="text-xl sm:text-2xl md:text-3xl font-light font-serif whitespace-pre-line">
        {content.description}
      </p>
    </div>
  );

  return (
    <div className="mx-[5%] sm:mx-[10%] my-[5%] bg-[#161412]">
      <Head>
        <title>{content ? content.title : "Loading..."}</title>
        <meta
          name="description"
          content={content ? content.description : "Loading content..."}
        />
        <meta name="keywords" content="React, Next.js, Supabase, SEO" />
        <meta
          property="og:title"
          content={content ? content.title : "Loading..."}
        />
        <meta
          property="og:description"
          content={content ? content.description : "Loading content..."}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.yourwebsite.com" />
        <meta name="robots" content="index, follow" />
      </Head>
      {!content ? (
        <p className="text-4xl sm:text-5xl md:text-6xl font-bold capitalize font-serif mb-4">
          Loading...
        </p>
      ) : (
        renderContent()
      )}
    </div>
  );
}
