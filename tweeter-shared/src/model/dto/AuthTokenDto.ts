export class AuthTokenDto {
  public token: string;
  public timestamp: number;
  public alias: string;

  public constructor(token: string, timestamp: number, alias: string) {
    this.token = token;
    this.timestamp = timestamp;
    this.alias = alias;
  }
}
