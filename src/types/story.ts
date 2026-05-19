export type Category = "مضحكة" | "حزينة" | "ملهمة" | "أخرى";

export interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  created_at: string;
  likes: number;
  comments: any[];
}