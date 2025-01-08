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
  debug: true,
 callbacks: {
  async signIn(params){
    console.log(params);
    try{
      await prismaClient.user.create({
        data:{
          email:params.user.email || "no email",
          provider:"Google"
        }
      });
    }
    catch(e){
      console.log(e);
    }
    return true;
  }
 },
  pages: {
    signIn: "api/auth/signin", // Ensure this page exists
  },
});

export { handler as GET, handler as POST };
