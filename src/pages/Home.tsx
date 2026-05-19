import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, PenLine, BookOpen } from "lucide-react";
import { useStoryContext } from "../context/StoryContext";
import StoryCard from "../components/StoryCard";
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Home() {
  const { stories, toggleLike, addComment } = useStoryContext();

  const recent = stories.slice(0, 3);

  return (
    <div className="flex flex-col gap-16 py-12">
      {/* Hero */}
      <section className="relative max-w-5xl mx-auto px-4 text-center">
        {/* Decorative yellow blob */}
        <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand/20 rounded-full blur-3xl" />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative text-4xl md:text-6xl font-extrabold text-black dark:text-white tracking-tight leading-tight mb-6"
        >
        لأنك طالب هندسة<br />
          <span className="text-brand">قصتك ممكن تلهم غيرك .</span>
        </motion.h1>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-6xl mx-auto mt-10">
  {stories.map((story) => (
    <div key={story.id} className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-xl">
      <h3 className="text-xl font-bold text-white mb-2">{story.title}</h3>
      <p className="text-gray-300 line-clamp-3 mb-4">{story.content}</p>
      <div className="text-sm text-brand font-semibold">بواسطة: {story.author}</div>
    </div>
  ))}
</div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-lg mb-10"
        >
         بنتشارك هنا قصصنا سواء كانت ملهمة , حزينة او حتى مضحكة
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative flex flex-wrap justify-center gap-4"
        >
          <Link
            to="/share"
            className="inline-flex items-center gap-2 bg-black text-white hover:bg-brand hover:text-black px-6 py-3 rounded-xl font-semibold transition-colors duration-300"
          >
            <PenLine size={18} />
            شاركنا قصتك
          </Link>
          <Link
            to="/stories"
            className="inline-flex items-center gap-2 border-2 border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black px-6 py-3 rounded-xl font-semibold transition-colors duration-300"
          >
            <BookOpen size={18} />
            اقرأ قصة
          </Link>
        </motion.div>
      </section>

      {/* Recent Stories */}
      <section className="max-w-5xl mx-auto px-4 w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            أحدث القصص
          </h2>
          <Link
            to="/stories"
            className="text-sm font-medium text-gray-500 hover:text-black dark:hover:text-white flex items-center gap-1 transition-colors"
          >
            عرض الكل <ArrowRight size={14} />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            ماف قصص حاليا . خليك اول مشارك
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recent.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                onLike={toggleLike}
                onAddComment={addComment}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
