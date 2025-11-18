import {
  AToBRequest,
  DoesAFollowBResponse,
  EchoRequest,
  GetCountsRequest,
  GetCountsResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  PagedStatusItemRequest,
  PagedStatusItemResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  PingRequest,
  PostStatusRequest,
  RegisterRequest,
  TweeterResponse,
  User,
  UserRequest,
  UserResponse,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  public static instance: ServerFacade = new ServerFacade();

  private SERVER_URL = "https://y57wcbkskj.execute-api.us-east-2.amazonaws.com/Stage";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async ping(
    request: PingRequest
  ): Promise<string> {
    const response = await this.clientCommunicator.doPost<
      PingRequest,
      TweeterResponse
    >(request, "/learning/ping");

    if (response.success) {
      return response.message!;
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async echo(
    request: EchoRequest
  ): Promise<string> {
    const response = await this.clientCommunicator.doPost<
      EchoRequest,
      TweeterResponse
    >(request, "/learning/echo");

    if (response.success) {
      return response.message!;
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getUser(
    request: UserRequest
  ): Promise<User | null> {
    const response = await this.clientCommunicator.doPost<
      UserRequest,
      UserResponse
    >(request, "/auth/user");

    if (response.success) {
      if (response.user) {
        return response.user ? User.fromDto(response.user) : null;
      } else {
        return null;
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getIsFollowerStatus(
    request: AToBRequest
  ): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<
      AToBRequest,
      DoesAFollowBResponse
    >(request, "/follow/doesAFollowB");

    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
    return response.isFollower;
  }

  public async getFollowerCount(
    request: GetCountsRequest
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      GetCountsRequest,
      GetCountsResponse
    >(request, "/follow/getCounts");

    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
    return response.followers;
  }

  public async getFolloweeCount(
    request: GetCountsRequest
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      GetCountsRequest,
      GetCountsResponse
    >(request, "/follow/getCounts");

    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
    return response.followees;
  }

  public async follow(
    request: AToBRequest
  ): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<
      AToBRequest,
      GetCountsResponse
    >(request, "/follow/setAFollowB");

    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
    return true;
  }

  public async unfollow(
    request: AToBRequest
  ): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<
      AToBRequest,
      GetCountsResponse
    >(request, "/follow/setAUnfollowB");

    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
    return true;
  }

  public async getStory(
    request: PagedStatusItemRequest
  ): Promise<PagedStatusItemResponse> {
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/post/getStatus");
    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
    return response;
  }

  public async getFeed(
    request: PagedStatusItemRequest
  ): Promise<PagedStatusItemResponse> {
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/post/getPosts");
    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
    return response;
  }

  public async postStatus(
    request: PostStatusRequest
  ): Promise<TweeterResponse> {
    const reponse = await this.clientCommunicator.doPost<any, any>(
      request,
      "/post/postStatus"
    );
    if (!reponse.success) {
      console.error(reponse);
      throw new Error(reponse.message ?? undefined);
    }
    return reponse;
  }

  public async getMoreFollowees(
    request: PagedUserItemRequest
  ): Promise<PagedUserItemResponse> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/follow/getFollowees");

    if (response.success) {
      return response
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getMoreFollowers(
    request: PagedUserItemRequest
  ): Promise<PagedUserItemResponse> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/follow/getFollowers");

    if (response.success) {
      return response
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async logout(
    request: LogoutRequest
  ): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      LogoutRequest,
      TweeterResponse
    >(request, "/auth/logout");

    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async register(
    request: RegisterRequest
  ): Promise<any> {
    const response = await this.clientCommunicator.doPost<
      RegisterRequest,
      LoginResponse
    >(request, "/auth/register");

    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
    return response;
  }

  public async login(
    request: LoginRequest
  ): Promise<any> {
    const response = await this.clientCommunicator.doPost<
      LoginRequest,
      LoginResponse
    >(request, "/auth/login");

    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
    return response;
  }
  
}