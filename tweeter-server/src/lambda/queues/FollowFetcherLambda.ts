import { SQSEvent } from "aws-lambda";
import { DynamoDaoFactory } from "../../dynamo_daos/DynamoDaoFactory";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { JobQueue } from "../../dynamo_daos/DynamoConstants";

const JOB_CHUNK_SIZE = 250;

export const handler = async (event: SQSEvent) => {
  const factory = new DynamoDaoFactory();
  const followDao = factory.getFollowDao();
  const sqs = new SQSClient({});

  for (const record of event.Records) {
    const body = JSON.parse(record.body);
    const { authorAlias, status } = body;

    const followerResult = await followDao.getAllFollowers(authorAlias, null);
    const followers = followerResult.items;
    
    for (let i = 0; i < followers.length; i += JOB_CHUNK_SIZE) {
      const chunk = followers.slice(i, i + JOB_CHUNK_SIZE);
      await sqs.send(new SendMessageCommand({
        QueueUrl: JobQueue.URL,
        MessageBody: JSON.stringify({ authorAlias, status, followerAliases: chunk })
      }));
    }
  }
};
