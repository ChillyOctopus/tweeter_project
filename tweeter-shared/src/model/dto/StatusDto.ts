import { UserDto } from "./UserDto";

export class StatusDto {
  public post: string;
  public user: UserDto;
  public timestamp: number;

  public constructor(post: string, user: UserDto, timestamp: number) {
    this.post = post;
    this.user = user;
    this.timestamp = timestamp;
  }
}
