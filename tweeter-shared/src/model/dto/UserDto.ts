export class UserDto {
  public firstName: string;
  public lastName: string;
  public alias: string;
  public imageUrl: string;

  public constructor(firstName: string, lastName: string, alias: string, imageUrl: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.alias = alias;
    this.imageUrl = imageUrl;
  }
}
