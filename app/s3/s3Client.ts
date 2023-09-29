import { S3Client } from "@aws-sdk/client-s3";

const REGION = process.env.BUCKET_REGION || "us-west-1";

const s3Client = new S3Client({ region: REGION });

export default s3Client;