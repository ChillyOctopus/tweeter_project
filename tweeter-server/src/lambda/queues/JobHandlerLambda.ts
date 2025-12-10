import { SQSEvent } from "aws-lambda";
import { DynamoDbClientWrapper } from "../../dynamo_daos/DynamoDbClientWrapper";
import { FeedTable } from "../../dynamo_daos/DynamoConstants";

export const handler = async (event: SQSEvent) => {
  const db = new DynamoDbClientWrapper();

  console.log(`JobHandler received ${event.Records.length} messages`);

  for (const record of event.Records) {
    const job = JSON.parse(record.body);
    const { status, followerAliases } = job;

    // Normalize aliases (in case they are objects)
    const aliases: string[] = (followerAliases || []).map((a: any) => {
      if (typeof a === "string") return a;
      if (a.follower_alias) return a.follower_alias;
      if (a.alias) return a.alias;
      return String(a);
    }).filter(Boolean);

    console.log(`JobHandler: writing status ${status?.timestamp} to ${aliases.length} followers`);
    const normalizedTimestamp =
      typeof status.timestamp === "string"
        ? Number(status.timestamp)
        : status.timestamp;
    console.log("JobHandler item timestamp:", normalizedTimestamp, typeof normalizedTimestamp);

    // create items per follower
    const items = aliases.map(alias => ({
      [FeedTable.PK]: alias,
      [FeedTable.SK]: normalizedTimestamp,
      [FeedTable.ATTR_POST]: status.post,
      [FeedTable.ATTR_USER_OBJECT]: JSON.stringify(status.user), // store user as JSON string or expand fields
    }));

    for (const item of items) {
      console.log("FEED WRITE ITEM:", JSON.stringify(item));
      console.log("  PK userAlias:", item.userAlias, typeof item.userAlias);
      console.log("  SK timestamp:", item.timestamp, typeof item.timestamp);
    }

    // Use wrapper.batchWrite which should chunk to 25 and retry unprocessed items
    await db.batchWrite(FeedTable.TABLE, items);
    console.log(`JobHandler: enqueued ${items.length} items to feed table (logical)`);
  }
};
