import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { ImageWithUrl } from "@/types/api";
import { FolderType } from "@/types/components";
import { getThumbnailUrl } from "@/lib/aws/getThumbnailUrl";
import { normalizeError } from "@/lib/utility/normalizeError";

export default async function getContent(currFolderId?: string) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const sessionRes = await supabase.auth.getSession();
    if (sessionRes.data.session === null) {
        throw new Error("Missing user session");
    }

    let folderId;
    if (!currFolderId) {
        // Get root folder id
        const rootFolderRes = await supabase
            .from("folder")
            .select("id")
            .filter("parent", "is", "null");
        if (rootFolderRes.error) {
            throw new Error(normalizeError(rootFolderRes.error));
        }

        folderId = rootFolderRes.data[0].id as string;
    } else {
        folderId = currFolderId;
    }

    // Get folder path
    const folderPathRes = await supabase.rpc("get_folder_path", {
        f_id: folderId,
    });
    if (folderPathRes.error) {
        throw new Error(normalizeError(folderPathRes.error));
    }

    const folderPath = folderPathRes.data as FolderType[];

    // Get nested folders
    const nestedFoldersRes = await supabase
        .from("folder")
        .select("name, id")
        .eq("parent", folderId)
        .order("name");
    if (nestedFoldersRes.error) {
        throw new Error(normalizeError(nestedFoldersRes.error));
    }

    const nestedFolders = nestedFoldersRes.data as FolderType[];

    // Get images in current folder
    const imagesResponse = await supabase
        .from("image")
        .select("s3_id, name, created_at")
        .eq("folder_id", folderId)
        .order("name");
    if (imagesResponse.error) {
        throw new Error(normalizeError(imagesResponse.error));
    }

    try {
        // Request presigned URLs from AWS for each image thumbnail
        const images: ImageWithUrl[] = await Promise.all(
            imagesResponse.data.map(async (entry) => {
                const signedUrl = await getThumbnailUrl(
                    entry.s3_id,
                    entry.name
                );
                return { ...entry, signedUrl };
            })
        );

        return { images, folderPath, folderId, nestedFolders };
    } catch (error) {
        throw new Error(normalizeError(error));
    }
}
