/**
 * Story and Comment type definitions
 * Edit these structures if you want to store extra fields
 */

export type Category = "ملهمة" | "حزينة" | "مضحكة";

export interface Comment {
  id: string;
  author: string;
  text: string;
  date: string; // ISO string
}

export interface Story {
  id: string;
  title: string;
  category: Category;
  content: string;
  author: string; // optional name fallback "Anonymous"
  date: string;
  likes: number;
  comments: Comment[];
}
