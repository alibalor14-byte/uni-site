import { createContext, useContext, type ReactNode } from "react";
import { useStories } from "@/hooks/useStories";
import type { Story, Comment, Category } from "@/types/story";

interface StoryContextValue {
  stories: Story[];
  addStory: (payload: Omit<Story, "id" | "date" | "likes" | "comments">) => void;
  toggleLike: (id: string) => void;
  addComment: (storyId: string, comment: Omit<Comment, "id" | "date">) => void;
  getByCategory: (category: Category | "All") => Story[];
}

const StoryContext = createContext<StoryContextValue | null>(null);

export function StoryProvider({ children }: { children: ReactNode }) {
  const value = useStories();
  return <StoryContext.Provider value={value}>{children}</StoryContext.Provider>;
}

export function useStoryContext() {
  const ctx = useContext(StoryContext);
  if (!ctx) throw new Error("useStoryContext must be used inside StoryProvider");
  return ctx;
}
