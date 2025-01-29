import { NextRequest, NextResponse } from "next/server";
import { z } from "zod"
import { prismaClient } from "../../lib/db";
import { Stream } from "stream";
// import { prismaClient } from "../lib/db";
const CreateStreamSchema = z.object({
    userId: z.string(),
    StreamId: z.string()
})

export async function POST(req: NextRequest) {
    try {
        const { userId, StreamId } = CreateStreamSchema.parse(req.body)
        const stream = await prismaClient.stream.create({
            data: {
                userId: userId,
                streamId: StreamId
            }
        })
        return NextResponse.json({
            message:"added url",
            id: stream.id
        },{
            status:200
        })
    } catch (e) {
        return NextResponse.json({
            message: e
        }, {
            status: 411
        })
    }

}

export async function  GET(req:NextRequest) {
    const creatorId = req.nextUrl.searchParams.get("creatorId");
    const streams= await prismaClient.stream.findMany({
        where:{
            userId: creatorId ?? ""
        }
    })
    return NextResponse.json({
        streams
    })
}