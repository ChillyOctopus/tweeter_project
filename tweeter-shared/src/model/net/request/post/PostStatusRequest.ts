import { TweeterRequest } from "../TweeterRequest";
import { AuthTokenDto } from "../../../dto/AuthTokenDto";
import { StatusDto } from "../../../dto/StatusDto";

export interface PostStatusRequest extends TweeterRequest {
    readonly token: AuthTokenDto;
    readonly status: StatusDto;
}