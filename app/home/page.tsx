import Gallery from "@/components/home/Gallery";
import getContent from "../../lib/server/getContent";

export default async function HomePage() {
    const props = await getContent();

    return <Gallery {...props} />;
}
