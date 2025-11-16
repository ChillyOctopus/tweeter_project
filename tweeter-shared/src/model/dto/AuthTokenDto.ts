export class AuthTokenDto {
  public token: string;
  public timestamp: number;

  public constructor(token: string, timestamp: number) {
    this.token = token;
    this.timestamp = timestamp;
  }
}
