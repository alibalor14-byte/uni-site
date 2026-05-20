import { useState, useEffect } from "react";
import type { Story, Category } from "../types/story";
import { supabase } from "../lib/supabase";

export function useStories() {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    const fetchStories = async () => {
  const { data, error } = await supabase
    .from('stories')
    .select('*');

  if (error) {
    console.error("Error fetching stories:", error);
  } else if (data) {
    // هنا السحر: نحول content إلى description قبل ما نرسلها للتطبيق
    const formattedStories = data.map(story => ({
      ...story,
      description: story.description || story.content // لو لقاها description خير وبركة، لو لقاها content يحولها
    }));
    setStories(formattedStories as Story[]);
  }
};

    fetchStories();
  }, []);

  const addStory = async (payload: Omit<Story, "id" | "create_at" | "likes">) => {
  // تجهيز البيانات لإرسالها لـ Supabase
  const { data, error: supabaseError } = await supabase
    .from('stories')
    .insert([
      {
        title: payload.title,
        content: payload.content,
        author: payload.author,
        category: payload.category,
        likes: 0,
      }
    ])
    .select(); // نطلب من Supabase يرجع لنا القصة بعد ما انحفظت

  if (supabaseError) {
    console.error("Error adding story:", supabaseError);
  } else if (data) {
    // تحديث الواجهة فوراً بالقصة الجديدة اللي رجعت من القاعدة
    setStories(prev => [data[0] as Story, ...prev]);
  }
};

const toggleLike = async (id: string) => {
  const story = stories.find(s => s.id === id);
  if (!story) {
    console.error("لم يتم العثور على القصة في الـ State!");
    return;
  }
  
  const currentLikes = story.likes || 0;
  const newLikes = currentLikes + 1;

  setStories(prev => prev.map(s => s.id === id ? { ...s, likes: newLikes } : s));

  console.log("جاري تحديث القصة رقم:", id, "إلى عدد لايكات:", newLikes);

  const { data, error } = await supabase
    .from('stories')
    .update({ likes: newLikes })
    .eq('id', id)
    .select(); // إضافة .select() مهمة جداً لرؤية النتيجة

  if (error) {
    // هذا السطر سيكشف لنا السبب الحقيقي (RLS، خطأ في العمود، إلخ)
    console.error("خطأ Supabase بالتفصيل:", error);
    // تراجع عن التحديث إذا حدث خطأ
    setStories(prev => prev.map(s => s.id === id ? { ...s, likes: currentLikes } : s));
  } else {
    console.log("تم التحديث بنجاح في Supabase!");
  }
};


  /** Filter stories by category */
  const getByCategory = (category: Category | "All") => {
    if (category === "All") return stories;
    return stories.filter((s) => s.category === category);
  };

  return { stories, addStory, toggleLike, getByCategory };
}
