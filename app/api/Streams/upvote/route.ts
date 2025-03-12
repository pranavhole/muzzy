import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prismaClient } from "../../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth-optiosn";


const UpVotesSchema = z.object({
  StreamId: z.string()
});

export async function POST(req: NextRequest) {
  // Pass auth options to getServerSession
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const user = await prismaClient.user.findFirst({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { StreamId } = UpVotesSchema.parse(body.data);

    const stream = await prismaClient.upVotes.create({
      data: {
        userId: user.id,
        StreamId: StreamId
      }
    });
    const upvotesCount = await prismaClient.upVotes.count({
      where: {
          StreamId: StreamId
      }
  });
    return NextResponse.json(
      { message: "upvoted", id: stream.id , upvotesCount:upvotesCount},
      { status: 200 }
    );
  } catch (e: any) {
    // console.log("Upvote error:", e);
    return NextResponse.json(
      { message: "Error upvoting stream" },
      { status: 400 }
    );
  }
}