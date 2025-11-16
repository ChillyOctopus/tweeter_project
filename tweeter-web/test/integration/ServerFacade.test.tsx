import "@testing-library/jest-dom";
import { instance, mock, when, verify, anyNumber, anyOfClass, anything } from "@typestrong/ts-mockito";
import { User, AuthToken } from "tweeter-shared";
import { ServerFacade } from "../../src/network/ServerFacade";

jest.mock("../../src/network/ServerFacade");

describe("Server Facade", () => {
  const mockUser = new User("First", "Last", "@alias", "imageUrl");
  const mockToken = new AuthToken("mockTokenValue", Date.now());
  const mockServerFacade = mock<ServerFacade>();

  beforeAll(() => {

  });

  it("registers a new user", async () => {
    const regReq = {
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        alias: mockUser.alias,
        password: "password",
        imageBytes: new Uint8Array(),
        imageFileExtension: "png"
    }
    when(mockServerFacade.register(regReq)).thenResolve({
        user: mockUser,
        authToken: anyOfClass(AuthToken)
    });
  });

  it("gets followers", async () => {
    const { userAlias, pageSize, lastItem } = {
      userAlias: mockUser.alias,
      pageSize: 10,
      lastItem: null
    };
    const getFollowersReq = {
      token: mockToken.dto,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem
    };
    when(mockServerFacade.getMoreFollowers(getFollowersReq)).thenResolve({
      success: true,
      message: null,
      items: [mockUser.dto],
      hasMore: anything()
    });
  });

  it("gets follower / followee count", async () => {
    const getCountsReq = {
      token: mockToken.dto,
      user: mockUser.dto
    };
    when(mockServerFacade.getFolloweeCount(getCountsReq)).thenResolve(anyNumber());
    when(mockServerFacade.getFollowerCount(getCountsReq)).thenResolve(anyNumber());
  });
});
