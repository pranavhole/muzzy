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
  callbacks: {
    async signIn(params) {
   
      try {
        const inputEmail: string | null | undefined =params.user.email; // Example function
        if (!inputEmail) {
          throw new Error("Email is required");
        }
        const email: string = inputEmail;
        console.log("data created");
        await prismaClient.user.create({
          data: {
            email:email ,
            provider: "Google",
            role:"EndUser"
          }
          
        });
      } catch (error) {
        console.log(error);

      }
      return true
    }



  }
})

export { handler as GET, handler as POST }

// export function GET (){
//     return({
//         message:"Hi There"
//     }
//     )
// }