import { StatusDto } from "tweeter-shared";

export abstract class AbstractStatusDao {
  abstract postToStory(authorAlias: string, status: StatusDto): Promise<void>
  abstract postToFeedBatch(followerAliases: string[], status: StatusDto): Promise<void>
  abstract getStory(alias: string, lastItem: StatusDto | null): Promise<{items: StatusDto[], hasMore: boolean}>
  abstract getFeed(alias: string, lastItem: StatusDto | null): Promise<{items: StatusDto[], hasMore: boolean}>
}
