import { AbstractS3Dao } from "../abstract_daos/AbstractS3Dao";
import {
    S3Client,
    PutObjectCommand,
    PutObjectCommandInput,
    ObjectCannedACL,
} from "@aws-sdk/client-s3";

export class DynamoS3Dao extends AbstractS3Dao {
  async putImage(fileName: string, imageStringBase64Encoded: string): Promise<string> {
    const decoded = Buffer.from(imageStringBase64Encoded, "base64");
    const s3Params: PutObjectCommandInput = {
      Bucket: process.env.BUCKET!,
      Key: `image/${fileName}`,
      Body: decoded,
      ContentType: "image/png",
      ACL: ObjectCannedACL.public_read,
    };
    const client = new S3Client({ region: process.env.REGION! });
    await client.send(new PutObjectCommand(s3Params));
    return `https://${process.env.BUCKET}.s3.${process.env.REGION}.amazonaws.com/image/${fileName}`;
  }
}
