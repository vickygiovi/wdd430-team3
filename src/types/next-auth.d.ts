import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: 'artesano' | 'cliente';
      is_active: boolean;
      full_name?: string;
      avatar_url?: string;
      bio?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    username: string;
    role: 'artesano' | 'cliente';
    is_active: boolean;
    full_name?: string;
    avatar_url?: string;
    bio?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    role: 'artesano' | 'cliente';
    is_active: boolean;
    full_name?: string;
    avatar_url?: string;
    bio?: string;
  }
}
