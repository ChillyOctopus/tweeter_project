import { SQSEvent } from "aws-lambda";
import { DynamoDbClientWrapper } from "../../dynamo_daos/DynamoDbClientWrapper";
import { FeedTable } from "../../dynamo_daos/DynamoConstants";

const BATCH_WRITE_SIZE = 25;

export const handler = async (event: SQSEvent) => {
  const db = new DynamoDbClientWrapper();

  for (const record of event.Records) {
    const job = JSON.parse(record.body);
    const { status, followerAliases } = job;

    // create items per follower
    const items = followerAliases.map(alias => ({
      [FeedTable.PK]: alias,
      [FeedTable.SK]: status.timestamp,
      [FeedTable.ATTR_POST]: status.post,
    }));

    await db.batchWrite(FeedTable.TABLE, items); // ensure wrapper handles 25 chunking and retries
  }
};
