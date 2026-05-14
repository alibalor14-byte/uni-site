import { useState, useEffect } from "react";
import type { Story, Comment, Category } from "../types/story";
import { supabase } from "../lib/supabase";
const STORAGE_KEY = "storyshare_stories";

// Demo data shown on first visit so the feed is never empty
const demoStories: Story[] = [];

/** Load stories from local storage (or demo data on first visit) */
function getInitialStories(): Story[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Story[];
  } catch {
    // ignore parse errors
  }
  return demoStories;
}

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
        setStories(data as Story[]);
      }
    };

    fetchStories();
  }, []);

  /** Add a new story */
  const addStory = (
    payload: Omit<Story, "id" | "date" | "likes" | "comments">
  ) => {
    const newStory: Story = {
      ...payload,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      likes: 0,
      comments: [],
    };
    setStories((prev) => [newStory, ...prev]);
  };

  /** Increase like count for a story */
  const toggleLike = (id: string) => {
    setStories((prev) =>
      prev.map((s) => (s.id === id ? { ...s, likes: s.likes + 1 } : s))
    );
  };

  /** Add a comment to a story */
  const addComment = (
    storyId: string,
    comment: Omit<Comment, "id" | "date">
  ) => {
    const newComment: Comment = {
      ...comment,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    setStories((prev) =>
      prev.map((s) =>
        s.id === storyId
          ? { ...s, comments: [...s.comments, newComment] }
          : s
      )
    );
  };

  /** Filter stories by category */
  const getByCategory = (category: Category | "All") => {
    if (category === "All") return stories;
    return stories.filter((s) => s.category === category);
  };

  return { stories, addStory, toggleLike, addComment, getByCategory };
}
