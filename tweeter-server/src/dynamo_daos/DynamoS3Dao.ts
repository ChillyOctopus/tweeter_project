import { AbstractS3Dao } from "../abstract_daos/AbstractS3Dao";
import {
    S3Client,
    PutObjectCommand,
    PutObjectCommandInput,
    ObjectCannedACL,
} from "@aws-sdk/client-s3";

export class DynamoS3Dao extends AbstractS3Dao {
  private BUCKET: string = "bucket-8257-6541-7292-num-0";
  async putImage(fileName: string, imageStringBase64Encoded: string): Promise<string> {
    const decoded = Buffer.from(imageStringBase64Encoded, "base64");
    const s3Params: PutObjectCommandInput = {
      Bucket: this.BUCKET,
      Key: `image/${fileName}`,
      Body: decoded,
      ContentType: "image/png",
      ACL: ObjectCannedACL.public_read,
    };
    const client = new S3Client({ region: "us-east-2" });
    await client.send(new PutObjectCommand(s3Params));
    return `https://${this.BUCKET}.s3.us-east-2.amazonaws.com/image/${fileName}`;
  }
}
