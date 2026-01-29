import { PresignedUrlSuccess } from "@/types/api";

export async function uploadToS3(urlResponse: PresignedUrlSuccess, file: File) {
    const formData = new FormData();
    Object.keys(urlResponse.fields).forEach((key) => {
        formData.append(key, urlResponse.fields[key]);
    });
    formData.append("file", file);

    // Fetch using url from aws
    return await fetch(urlResponse.presignedUrl, {
        method: "POST",
        body: formData,
    });
}
