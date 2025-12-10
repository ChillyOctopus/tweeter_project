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

// Hello World! @b @c @d @e @f @g @h @i @j @k @l @m @n @o @p @q @r @s