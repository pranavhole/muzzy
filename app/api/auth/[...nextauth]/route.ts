import NextAuth from "next-auth";
import { authOptions } from "../../lib/auth-optiosn";


const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };