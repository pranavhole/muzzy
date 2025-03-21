import { NextRequest, NextResponse } from "next/server";
import { z } from "zod"
import { prismaClient } from "../../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth-optiosn";
// import { prismaClient } from "../lib/db";
const UpVotesSchema = z.object({
    StreamId: z.string()
})

export async function POST(req: NextRequest) {

    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { StreamId } = UpVotesSchema.parse(body);

console.log(body);

    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email ?? ""
        }
    })
    if (!user) {
        return NextResponse.json({
            message: "Unauthorized"
        }, {
            status: 401
        })
    }
    try {
        const stream = await prismaClient.upVotes.delete({
            where: {
                userId_StreamId: {
                    userId: user.id,
                    StreamId: StreamId
                }
            }
        })
        const upvotesCount = await prismaClient.upVotes.count({
            where: {
                StreamId: StreamId
            }
        });
        return NextResponse.json({
            message: "downvoted",
            id: stream.id,
            upvotesCount:upvotesCount
        }, {
            status: 200
        })
    }
    catch (e: any) {
        return NextResponse.json({
            message: "Error Upvoting Stream"
        }, {
            status: 400
        })
    }
}
