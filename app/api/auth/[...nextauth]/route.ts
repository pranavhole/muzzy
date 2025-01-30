import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prismaClient } from "../../lib/db";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: "365930823054-5p65smnjot3dt90eb6pooqrb181kndqb.apps.googleusercontent.com",
      clientSecret: "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",
    }),
  ],
  debug: process.env.NODE_ENV !== "production",
  callbacks: {
    async signIn({ user }) {
      try {
        // Use upsert to handle existing users
        if (!user.email) {
          console.error("No email returned from provider");
          return false; // Prevent sign-in on missing email
        }
        await prismaClient.user.upsert({
          where: { email: user.email },
          update: { provider: "Google" }, // Update if exists
          create: {
            email: user.email, // Google always provides email, no fallback needed
            provider: "Google"
          }
        });
        return true;
      } catch (e) {
        console.error("Database error:", e);
        return false; // Prevent sign-in on database error
      }
    }
  },
  pages: {
    signIn: "/auth/signin", // Only if using custom page, otherwise remove
  },
});

export { handler as GET, handler as POST };