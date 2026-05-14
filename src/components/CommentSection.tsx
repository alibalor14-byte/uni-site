import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import type { Comment } from "@/types/story";

interface CommentSectionProps {
  comments: Comment[];
  onSubmit: (author: string, text: string) => void;
}

export default function CommentSection({ comments, onSubmit }: CommentSectionProps) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(name.trim() || "Anonymous", text.trim());
    setText("");
    setName("");
  };

  return (
    <div className="mt-2 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-4">
      {/* Comments list */}
      {comments.length === 0 ? (
        <p className="text-sm text-gray-400 italic">No comments yet. Be the first!</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {comments.map((c, idx) => (
            <motion.li
              key={c.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3 text-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {c.author}
                </span>
                <span className="text-[10px] text-gray-400">
                  {new Date(c.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{c.text}</p>
            </motion.li>
          ))}
        </ul>
      )}

      {/* Add comment form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand transition-shadow"
        />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand transition-shadow"
          />
          <button
            type="submit"
            className="bg-black text-white hover:bg-brand hover:text-black rounded-lg px-3 py-2 transition-colors"
            aria-label="Send comment"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
