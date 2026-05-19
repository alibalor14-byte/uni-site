import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Calendar } from "lucide-react";
import type { Story, Comment } from "../types/story";
import CommentSection from "./CommentSection";

interface StoryCardProps {
  story: Story;
  onLike: (id: string) => void;
  onAddComment: (storyId: string, comment: Omit<Comment, "id" | "date">) => void;
}

export default function StoryCard({ story, onLike, onAddComment }: StoryCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(true);
    onLike(story.id);
    setTimeout(() => setLiked(false), 600);
  };

  const categoryColors: Record<string, string> = {
    ملهمة: "bg-brand/20 text-yellow-800 dark:text-yellow-200",
    حزينه: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    مضحكه: "bg-brand/30 text-yellow-900 dark:text-yellow-100",
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col gap-4 border border-gray-100 dark:border-gray-800"
    >
      {/* Top row: category badge + date */}
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            categoryColors[story.category] || "bg-gray-100 text-gray-700"
          }`}
        >
          {story.category}
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <Calendar size={12} />
          {new Date(story.created_at).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-black dark:text-white leading-snug">
        {story.title}
      </h3>

      {/* Content */}
      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
        {story.content}
      </p>

      {/* Author */}
      <div className="text-xs font-medium text-gray-500 dark:text-gray-400">

        By {story.author || "Anonymous"}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-2 border-t border-gray-100 dark:border-gray-800">
        <motion.button
          whileTap={{ scale: 0.85 }}
          animate={liked ? { scale: [1, 1.25, 1] } : {}}
          transition={{ duration: 0.3 }}
          onClick={handleLike}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-brand-dark transition-colors"
          aria-label="Like story"
        >
          <Heart
            size={18}
            className={liked ? "fill-brand text-brand" : ""}
          />
          {story.likes}
        </motion.button>

        <button
          onClick={() => setShowComments((v) => !v)}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-black dark:hover:text-white transition-colors"
          aria-label="Toggle comments"
        >
          <MessageCircle size={18} />
          {story.comments?.length || 0}
        </button>
      </div>

      {/* Comment section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <CommentSection
              comments={story.comments}
              onSubmit={(author, text) => onAddComment(story.id, { author, text })}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
