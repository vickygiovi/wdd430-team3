export type Article = {
  title: string;
  slug: string;
  summary: string;
  content: string;
  author?: string;
  image?: string;
  tags: string[];
  published: boolean;
  createdAt: string; // could also use Date if you parse it later
};
