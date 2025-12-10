import { UserDto } from "tweeter-shared";

export abstract class AbstractFollowDao {
  abstract follow(follower: string, followee: string): Promise<void>
  abstract unfollow(follower: string, followee: string): Promise<void>
  abstract isFollower(follower: string, followee: string): Promise<boolean>
  abstract getFollowerCount(alias: string): Promise<number>
  abstract getFolloweeCount(alias: string): Promise<number>
  abstract getFollowers(alias: string, lastItem: UserDto | null): Promise<{items: string[], hasMore: boolean}>
  abstract getFollowees(alias: string, lastItem: UserDto | null): Promise<{items: string[], hasMore: boolean}>
}
