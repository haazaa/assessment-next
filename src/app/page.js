"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import { supabase } from "../lib/supabaseClient";

const Home = () => {
  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true); // To track first load

  const fetchContent = async () => {
    setError(null);
    try {
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .single();
      if (error) throw error;
      setContent(data);
      setInitialLoad(false); // Set initial load to false after first content load
    } catch (err) {
      setError("Failed to fetch content. Please try again later.");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchContent();

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
  }, []);

  const renderError = () => (
    <p className="text-2xl text-red-500 font-semibold">{error}</p>
  );

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
      {initialLoad ? (
        <p className="text-4xl sm:text-5xl md:text-6xl font-bold capitalize font-serif mb-4">
          Loading...
        </p>
      ) : (
        <>{error ? renderError() : renderContent()}</>
      )}
    </div>
  );
};

export default Home;
