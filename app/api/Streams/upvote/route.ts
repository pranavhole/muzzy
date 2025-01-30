import { NextRequest, NextResponse } from "next/server";
import { z } from "zod"
import { prismaClient } from "../../lib/db";
import { Stream } from "stream";
import { getServerSession } from "next-auth";
// import { prismaClient } from "../lib/db";
const UpVotesSchema = z.object({
    StreamId: z.string()
})

export async function POST(req: NextRequest) {

    const session = await getServerSession();
    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email ?? ""
        }
    })
    if (!user) {
        return NextResponse.json({
            message: JSON.stringify(session)
        }, {
            status: 401
        })
    }
    try {
        const stream = await prismaClient.upVotes.create({
            data: {
                userId: user.id,
                StreamId: UpVotesSchema.parse(req.body).StreamId
            }
        })
        return NextResponse.json({
            message: "upvoted",
            id: stream.id
        }, {
            status: 200
        })
    }
    catch (e:any) {
        return NextResponse.json({
            message: "error upvoting stream"
        }, {
            status: 400
        })
    }
}
