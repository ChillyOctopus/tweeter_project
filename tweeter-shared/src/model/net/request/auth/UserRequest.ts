import { TweeterRequest } from "../../../../../dist";
import { AuthTokenDto } from "../../../dto/AuthTokenDto";

export interface UserRequest extends TweeterRequest{
    readonly token: AuthTokenDto;
    readonly userAlias: string;
}