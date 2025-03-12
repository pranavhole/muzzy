import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prismaClient } from "../../lib/db";
import { authOptions } from "../../lib/auth-optiosn";

export async function GET() {
  try {
    const session = await getServerSession(authOptions); 
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prismaClient.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const streams = await prismaClient.stream.findMany({
      where: { userId: user.id },
      include: {
        _count: {
            select: {
                upvotes: true
            }
        },
        upvotes: {
            where: {
                userId: user.id
            }
        }   
      },
    });

    return NextResponse.json({ streams });
    
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}