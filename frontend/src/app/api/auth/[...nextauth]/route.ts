import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SiweMessage } from "siwe";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "siwe",
      name: "SIWE",
      credentials: {
        message: { label: "Message", type: "text" },
        signature: { label: "Signature", type: "text" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.message || !credentials?.signature) return null;

          const siwe = new SiweMessage(credentials.message);
          const result = await siwe.verify({
            signature: credentials.signature,
          });

          if (result.success) {
            return {
              id: siwe.address,
              address: siwe.address,
            };
          }
          return null;
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user = {
        ...session.user,
        address: token.address as string,
      };
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.address = user.address;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
