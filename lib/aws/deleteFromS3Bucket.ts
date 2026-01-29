import {
    DeleteObjectsCommand,
    DeleteObjectsOutput,
    ObjectIdentifier,
} from "@aws-sdk/client-s3";
import s3Client from "@/lib/aws/s3Client";

export default async function deleteFromS3Bucket(
    imageList: { s3_id: string }[]
) {
    if (imageList.length === 0) {
        return;
    }

    const imageKeys: ObjectIdentifier[] = [];
    for (const image of imageList) {
        imageKeys.push({ Key: image.s3_id });
    }

    // This command can handle at most 1000 keys
    const command = new DeleteObjectsCommand({
        Bucket: process.env.BUCKET_NAME!,
        Delete: { Objects: imageKeys },
    });

    const res = (await s3Client.send(command)) as DeleteObjectsOutput;

    if (res.Errors) {
        console.log(res.Errors);
        throw new Error("Deleting from S3 failed.");
    }
}
