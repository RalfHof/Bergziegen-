import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import type { NextAuthOptions } from 'next-auth';
import { cookies } from 'next/headers'; // Diesen Import behalten

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'E-Mail', type: 'email', placeholder: 'dein@email.de' },
        password: { label: 'Passwort', type: 'password' },
      },
      async authorize(credentials) {
        const supabase = createServerComponentClient({ cookies }); // Hier verwenden wir cookies

        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials?.email || '',
          password: credentials?.password || '',
        });

        if (error || !data.user) {
          console.error('Auth Error:', error?.message);
          return null;
        }

        return {
          id: data.user.id,
          email: data.user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export const GET = handler;
export const POST = handler;