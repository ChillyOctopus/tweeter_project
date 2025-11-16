import { AuthTokenDto } from "../../../dto/AuthTokenDto";
import { UserDto } from "../../../dto/UserDto";
import { TweeterRequest } from "../TweeterRequest";

export interface GetCountsRequest extends TweeterRequest {
    readonly user: UserDto;
    readonly token: AuthTokenDto;
}