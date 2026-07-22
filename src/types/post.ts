export type Post = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  coverImage?: string;
  coverAlt?: string;
  author: string;
  published: boolean;
  views: number;
  date: string;
  readingTime: string;
  createdAt?: string;
  updatedAt?: string;
};
