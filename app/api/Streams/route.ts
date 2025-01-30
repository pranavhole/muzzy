import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prismaClient } from "../lib/db";
//@ts-ignore
import youtubesearchapi from "youtube-search-api";

const YT_REGEX = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;
const CreateStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string()
});

export async function POST(req: NextRequest) {
    try {
        const data = CreateStreamSchema.parse(await req.json());
        const isYt = data.url.match(YT_REGEX);
        if (!isYt) {
            return NextResponse.json({
                message: "Wrong URL format"
            }, {
                status: 400
            });
        }

        const extractedId = data.url.split("?v=")[1];
        if (!extractedId) {
            return NextResponse.json({
                message: "Invalid YouTube URL: Video ID not found"
            }, {
                status: 400
            });
        }

        const res = await youtubesearchapi.GetVideoDetails(extractedId);
        const thumb = res.thumbnail.thumbnails;
        thumb.sort((a: { width: number }, b: { width: number }) => (a.width < b.width ? -1 : 1));
        const title = res.title;

        const stream = await prismaClient.stream.create({
            data: {
                userId: data.creatorId,
                url: data.url,
                extractedId,
                title: title ?? "Can't find",
                smallImg: (thumb.length > 1 ? thumb[thumb.length - 2].url : thumb[thumb.length - 1].url) ?? "cjefnj",
                bigImg: thumb[thumb.length - 1].url ?? "nncjd",
                type: "Youtube"
            }
        });

        return NextResponse.json({
            message: "Added URL",
            id: stream.id
        }, {
            status: 200
        });

    } catch (e) {
        return NextResponse.json({
            message: "An error occurred",
            error: e instanceof Error ? e.message : "Unknown error"
        }, {
            status: 500
        });
    }
}

export async function GET(req: NextRequest) {
    const creatorId = req.nextUrl.searchParams.get("creatorId");
    if (!creatorId) {
        return NextResponse.json({
            message: "creatorId is required"
        }, {
            status: 400
        });
    }

    const streams = await prismaClient.stream.findMany({
        where: {
            userId: creatorId
        }
    });

    return NextResponse.json({
        streams
    });
}