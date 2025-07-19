import { S3Client } from "@aws-sdk/client-s3";

export const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.VITE_R2_ENDPOINT || "",
  credentials: {
    accessKeyId: process.env.VITE_R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.VITE_R2_SECRET_ACCESS_KEY || "",
  },
});
