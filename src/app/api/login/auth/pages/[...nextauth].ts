import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Benutzername", type: "text" },
        password: { label: "Passwort", type: "password" }
      },
      async authorize(credentials) {
        // Hier Beispielbenutzer
        const user = {
          id: "1",
          name: "Ralf",
          email: "ralf@example.com"
        };

        if (
          credentials?.username === "ralf" &&
          credentials?.password === "passwort123"
        ) {
          return user;
        }

        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: 'dein-secret-code' // Optional für lokale Tests
});

export { handler as GET, handler as POST };
