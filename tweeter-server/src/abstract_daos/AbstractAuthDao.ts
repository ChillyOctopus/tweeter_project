import { AuthTokenDto, UserDto } from "tweeter-shared";

export abstract class AbstractAuthDao {
  abstract createUserRecord(user: UserDto, passwordHash: string): Promise<void>
  abstract increment_counts(alias: string, index: string, delta: number): Promise<void>
  abstract validateAuthToken(authToken: AuthTokenDto): Promise<boolean>
  abstract getUserRaw(alias: string): Promise<any | null>
  abstract getUserDtoByAlias(alias: string): Promise<UserDto | null>

  abstract storeAuthToken(tokenValue: string, alias: string, timestamp: number): Promise<void>
  abstract deleteAuthToken(tokenValue: string): Promise<boolean>
}
