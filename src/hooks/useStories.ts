import { useState, useEffect } from "react";
import type { Story, Comment, Category } from "../types/story";
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

  const addStory = async (payload: Omit<Story, "id" | "date" | "likes" | "comments">) => {
  // تجهيز البيانات لإرسالها لـ Supabase
  const { data, error } = await supabase
    .from('stories')
    .insert([
      {
        title: payload.title,
        content: payload.content,
        author: payload.author,
        category: payload.category,
        likes: 0,
        comments: []
      }
    ])
    .select(); // نطلب من Supabase يرجع لنا القصة بعد ما انحفظت

  if (error) {
    console.error("Error adding story:", error);
  } else if (data) {
    // تحديث الواجهة فوراً بالقصة الجديدة اللي رجعت من القاعدة
    setStories(prev => [data[0] as Story, ...prev]);
  }
};

  /** Increase like count for a story */
 const toggleLike = async (id: string) => {
  const story = stories.find(s => s.id === id);
  if (!story) return;

  const currentLikes = story.likes || 0;
  const newLikes = currentLikes + 1;

   setStories(prev => 
    prev.map(s => s.id === id ? { ...s, likes: newLikes } : s));
    
  const { error } = await supabase
    .from('stories')
    .update({ likes: newLikes })
    .eq('id', id);

  if (error) {
    console.error("Error updating likes:", error);
    setStories(prev =>
      prev.map(s => s.id === id ? { ...s, likes: currentLikes } : s)
    );
  }
};

 const addComment = async (storyId: string, comment: Omit<Comment, "id" | "date">) => {
  const story = stories.find(s => s.id === storyId);
  if (!story) return;

  const newComment = {
    ...comment,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  };

  const updatedComments = [...(story.comments || []), newComment];

  // تحديث قاعدة البيانات
  const { error } = await supabase
    .from('stories')
    .update({ comments: updatedComments })
    .eq('id', storyId);

  if (error) {
    console.error("Error adding comment:", error);
  } else {
    // تحديث الواجهة
    setStories(prev =>
      prev.map(s => (s.id === storyId ? { ...s, comments: updatedComments } : s))
    );
  }
};

  /** Filter stories by category */
  const getByCategory = (category: Category | "All") => {
    if (category === "All") return stories;
    return stories.filter((s) => s.category === category);
  };

  return { stories, addStory, toggleLike, addComment, getByCategory };
}
