import { TweeterResponse, PingRequest } from "tweeter-shared";

export const handler = async (request: PingRequest): Promise<TweeterResponse> => {
    return { 
        success: true,
        message: "pong"
    }
}