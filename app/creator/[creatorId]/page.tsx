import StreamView from "@/components/ui/StreamView";

export default async function ({
    params
}: {
    params: Promise<{ creatorId: string }>
}) {
    const { creatorId } = await params;
    return <div><StreamView createrid={creatorId}/></div>
}