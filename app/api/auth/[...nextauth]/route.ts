import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { prismaClient } from "../../lib/db";


const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: "365930823054-5p65smnjot3dt90eb6pooqrb181kndqb.apps.googleusercontent.com",
      clientSecret: "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"
    })
  ],
  debug: true,
  callbacks: {
    async signIn(params:any) {
      try {
        const inputEmail = params.user.email;
        if (!inputEmail) {
          throw new Error("Email is required");
        }
        const email = inputEmail;
  
        await prismaClient.user.create({
          data: {
            email: email,
            provider: "Google",
            role: "EndUser",
          },
        });
        console.log("User created successfully");
      } catch (error) {
        console.error("Error during sign-in callback:", error);
        return false; // Returning false will reject the sign-in attempt
      }
      return true; 
    },
  },
  pages: {
    signIn: "/auth/signin",
  },  
})

export { handler as GET, handler as POST }

// export function GET (){
//     return({
//         message:"Hi There"
//     }
//     )
// }