import { TweeterRequest } from "../TweeterRequest";

export interface EchoRequest extends TweeterRequest{
    readonly voice: string;
}