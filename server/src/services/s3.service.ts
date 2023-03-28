import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import {
  S3_ACCESS_KEY,
  S3_BUCKET_REGION,
  S3_PP_BUCKET_NAME,
  S3_SECRET_ACCESS_KEY,
} from "../utils/config";

export const s3 = new S3Client({
  credentials: {
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
  },
  region: S3_BUCKET_REGION,
});

export const removeProfilePic = async (key: string) => {
  const command = new DeleteObjectCommand({
    Bucket: S3_PP_BUCKET_NAME,
    Key: key,
  });

  await s3.send(command);
};
