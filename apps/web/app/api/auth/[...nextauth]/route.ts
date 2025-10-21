import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { NextRequest } from 'next/server';

function isAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  const raw = process.env.ALLOWED_EMAILS || '';
  const list = raw.split(',').map(s => s.trim()).filter(Boolean);
  return list.includes(email);
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  callbacks: {
    async signIn({ user }) {
      return isAllowed(user?.email);
    },
    async session({ session }) {
      // セッションに email をそのまま残す
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
});

export { handler as GET, handler as POST };


