import Gallery from "@/components/home/Gallery";
import isUUID from "@/lib/utility/isUUID";
import { notFound } from "next/navigation";
import getContent from "@/lib/server/getContent";

export default async function FolderPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    if (!isUUID(id)) {
        return notFound();
    }
    const props = await getContent(id);

    return <Gallery {...props} />;
}
