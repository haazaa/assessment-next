"use client";

import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";
import Head from "next/head";

export default function Home({ initialContent }) {
  const [content, setContent] = useState(initialContent);

  // Fetch content if not already available or if it's outdated
  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .limit(1)
        .single();

      if (!error) setContent(data); // Set new content
    } catch (err) {
      console.error("Error fetching content:", err);
    }
  };

  // Real-time updates via subscription
  useEffect(() => {
    // Fetch content if initialContent doesn't match what's currently in state
    if (!content || content?.title !== initialContent?.title) {
      fetchContent();
    }

    // Subscription to listen for updates on content
    const subscription = supabase
      .channel("content-changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "content" },
        async (payload) => {
          // Update state when content is changed in the database
          if (payload.new?.id === content?.id) {
            setContent(payload.new);
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, [content, initialContent]);

  // Set title and description
  const Title = content?.title || "Loading...";
  const Description = content?.description || "Loading content...";

  return (
    <div className="mx-[5%] sm:mx-[10%] my-[5%]">
      <Head>
        <title>{Title}</title>
        <meta name="description" content={Description} />
        <meta name="keywords" content="React, Next.js, Supabase, SEO" />
        <meta property="og:title" content={Title} />
        <meta property="og:description" content={Description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://assessment-next.vercel.app/" />
        <meta name="robots" content="index, follow" />
      </Head>
      {content ? (
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold capitalize font-serif mb-4">
            {Title}
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl font-light font-serif whitespace-pre-line">
            {Description}
          </p>
        </div>
      ) : (
        <p className="text-4xl font-bold">Loading...</p>
      )}
    </div>
  );
}
