import { SQSEvent } from "aws-lambda";
import { DynamoDaoFactory } from "../../dynamo_daos/DynamoDaoFactory";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { JobQueue } from "../../dynamo_daos/DynamoConstants";

const JOB_CHUNK_SIZE = 250;

export const handler = async (event: SQSEvent) => {
  const factory = new DynamoDaoFactory();
  const followDao = factory.getFollowDao();
  const sqs = new SQSClient({});

  console.log(`FollowFetcher received ${event.Records.length} records`);

  for (const record of event.Records) {
    const body = JSON.parse(record.body);
    const { authorAlias, status } = body;

    // Request all followers (items may be raw objects)
    const followerResult = await followDao.getAllFollowers(authorAlias, null);
    const rawFollowers = followerResult.items || [];

    // Normalize to array of alias strings
    const followers: string[] = rawFollowers.map((f: any) => {
      // possible shapes: "bob", { follower_alias: "bob" }, { alias: "bob" }, UserDto
      if (typeof f === "string") return f;
      if (f.follower_alias) return f.follower_alias;
      if (f.alias) return f.alias;
      if (f.followee_alias) return f.followee_alias; // defensive
      // last-resort: try to stringify and extract common pattern
      return String(f);
    }).filter(Boolean);

    console.log(`Author ${authorAlias} has ${followers.length} followers`);

    for (let i = 0; i < followers.length; i += JOB_CHUNK_SIZE) {
      const chunk = followers.slice(i, i + JOB_CHUNK_SIZE);
      const message = { authorAlias, status, followerAliases: chunk };
      
      try {
        await sqs.send(new SendMessageCommand({
          QueueUrl: JobQueue.URL,
          MessageBody: JSON.stringify(message)
        }));
        console.log(`Enqueued job for ${chunk.length} followers (start ${i})`);
      } catch (err) {
        console.error(`Failed to enqueue job for chunk starting at ${i}:`, err);
        // Optional: rethrow to retry Lambda or implement custom retry
      }
    }
  }
};
