import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import deleteFromS3Bucket from "../deleteFromS3Bucket";

export async function POST(req: Request) {
    const { id } = await req.json();

    if (!id) {
        return NextResponse.json(
            { error: "Missing folder ID." },
            { status: 400 }
        );
    }

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Data is list of image s3_id
    const imagesRes = await supabase.rpc("get_nested_images", { f_id: id });
    if (imagesRes.error) {
        return NextResponse.json({ error: imagesRes.error }, { status: 500 });
    }

    // Delete images from S3
    try {
        await deleteFromS3Bucket(imagesRes.data);
    } catch (err) {
        return NextResponse.json({ error: err }, { status: 500 });
    }

    // Delete folder from supabase
    // Cascade delete will handle nested folders and images
    const folderRes = await supabase.from("folder").delete().eq("id", id);
    if (folderRes.error) {
        return NextResponse.json({ error: folderRes.error }, { status: 500 });
    }

    return NextResponse.json({ message: "Folder deleted." });
}
