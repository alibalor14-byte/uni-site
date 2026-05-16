export type Category = "مضحكة" | "حزينة" | "ملهمة" | "أخرى";

export interface Comment {
  id: string;
  author: string;
  text: string;
  date: string; // ISO string
}

export interface Story {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  created_at: string; // أضف هذا أو استبدل date به
  likes: number;
  comments: any[];
}