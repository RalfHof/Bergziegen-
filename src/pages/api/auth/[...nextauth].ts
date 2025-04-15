// src/pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Benutzername', type: 'text' },
        password: { label: 'Passwort', type: 'password' },
      },
      async authorize(credentials) {
        if (
          credentials?.username === 'ralf' &&
          credentials?.password === 'geheim'
        ) {
          return { id: '1', name: 'Ralf' };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  secret: 'super-secret', // in production in .env!
});

export default handler;
