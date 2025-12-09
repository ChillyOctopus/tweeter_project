import { UserDto } from "tweeter-shared";

export abstract class AbstractFollowDao {
  abstract follow(follower: string, followee: string): Promise<void>
  abstract unfollow(follower: string, followee: string): Promise<void>
  abstract getAllFollowers(alias: string): Promise<string[]> 
  abstract isFollower(follower: string, followee: string): Promise<boolean>
  abstract getFollowerCount(alias: string): Promise<number>
  abstract getFolloweeCount(alias: string): Promise<number>
  abstract getFollowers(alias: string, lastItem: UserDto | null): Promise<{items: UserDto[], hasMore: boolean}>
  abstract getFollowees(alias: string, lastItem: UserDto | null): Promise<{items: UserDto[], hasMore: boolean}>
}
