import { TweeterRequest } from "../../../../../dist";
import { AuthTokenDto } from "../../../dto/AuthTokenDto";
import { UserDto } from "../../../dto/UserDto";

export interface AToBRequest extends TweeterRequest{
    readonly token: AuthTokenDto;
    readonly userAliasA: string;
    readonly userAliasB: string;
}