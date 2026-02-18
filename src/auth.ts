import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
 
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(
            password,
            user.password_hash
          );

          if (passwordsMatch) {
            return user;
          }
        }

        return null;
      },
    }),
  ],

  callbacks: {
    ...authConfig.callbacks,
    
    async jwt({ token, user }) {
      // Cuando el usuario hace login
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
        token.is_active = user.is_active;
        token.full_name = user.full_name;
        token.avatar_url = user.avatar_url;
        token.bio = user.bio;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.role = token.role as 'artesano' | 'cliente';
        session.user.is_active = token.is_active as boolean;
        session.user.full_name = token.full_name as string | undefined;
        session.user.avatar_url = token.avatar_url as string | undefined;
        session.user.bio = token.bio as string | undefined;
      }

      return session;
    },
  },
});
