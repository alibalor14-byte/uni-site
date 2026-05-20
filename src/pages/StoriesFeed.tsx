import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter } from "lucide-react";
import { useStoryContext } from "../context/StoryContext";
import StoryCard from "../components/StoryCard";
import type { Category } from "../types/story";
import { supabase } from '../supabaseClient';

type FilterOption = Category | "الكل";

const filters: FilterOption[] = ["الكل", "ملهمة", "حزينة", "مضحكة"];

export default function StoriesFeed() {
  const { addComment } = useStoryContext(); 
  
  const [stories, setStories] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterOption>("الكل");

  useEffect(() => {
    const fetchStories = async () => {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setStories(data);
    };
    fetchStories();
  }, []);

  // 3. تعديل خاصية اللايك لتعمل مع Supabase (اختياري حالياً لكنه يحل العطل)
  const handleLike = async (id: string, currentLikes: number) => {
  // 1. تحديث قاعدة البيانات
  const { error } = await supabase
    .from('stories')
    .update({ likes: currentLikes + 1 })
    .eq('id', id);

  if (error) {
    console.error("Error updating likes:", error);
    return; // أوقف العملية إذا حدث خطأ
  }

  // 2. تحديث الواجهة فوراً (كما كنت تفعل)
  setStories(prev => prev.map(s => 
    s.id === id ? { ...s, likes: (s.likes || 0) + 1 } : s
  ));
};

  const filtered = activeFilter === "الكل" 
    ? stories 
    : stories.filter(s => s.category === activeFilter);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
          قصص تمت مشاركتها
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          قصص من قلب حياتنا الجامعيه.
        </p>
      </motion.div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        <Filter size={16} className="text-gray-400 mr-1" />
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
              activeFilter === f
                ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
                : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium">ماف قصص حاليا.</p>
          <p className="text-sm">كون اول من يشارك!</p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                onLike={handleLike}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
