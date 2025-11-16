import { AuthTokenDto } from "../../../dto/AuthTokenDto";
import { UserDto } from "../../../dto/UserDto";
import { TweeterRequest } from "../TweeterRequest";

export interface PagedUserItemRequest extends TweeterRequest {
    readonly token: AuthTokenDto;
    readonly userAlias: string;
    readonly pageSize: number;
    readonly lastItem: UserDto | null;
}