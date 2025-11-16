import { TweeterRequest } from "../../../../../dist";

export interface EchoRequest extends TweeterRequest{
    readonly voice: string;
}