import "@testing-library/jest-dom";
import { anyNumber, anyOfClass, anything } from "@typestrong/ts-mockito";
import { User, AuthToken } from "tweeter-shared";
import { ServerFacade } from "../../src/network/ServerFacade";
import "isomorphic-fetch";

describe("Server Facade", () => {
  const mockUser = new User("Allen", "Anderson", "@allen", "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png");
  const mockToken = new AuthToken("mockTokenValue", Date.now());
  let serverFacade: ServerFacade;

  beforeAll(() => {
    serverFacade = new ServerFacade();
  });

  it("registers a new user", async () => {
    const regReq = {
        firstName: "mockUser.firstName",
        lastName: "mockUser.lastName",
        alias: "mockUser.alias",
        password: "password",
        imageBytes: new Uint8Array([8,8,8,8]),
        imageFileExtension: "png"
    }
    let result = await serverFacade.register(regReq);

    expect(result).toBe({message: null, success: true, user: mockUser.dto, token: anyOfClass(AuthToken)})
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
    let result = await serverFacade.getMoreFollowers(getFollowersReq);
    expect(result).toBe(
      {
        success: true,
        message: null,
        items: [mockUser.dto],
        hasMore: anything()
      }
    )
  });

  it("gets follower / followee count", async () => {
    const getCountsReq = {
      token: mockToken.dto,
      user: mockUser.dto
    };
    let result1 = await serverFacade.getFolloweeCount(getCountsReq);
    expect(result1).toBeGreaterThanOrEqual(0);
    let result2 = await serverFacade.getFollowerCount(getCountsReq);
    expect(result2).toBeGreaterThanOrEqual(0);
  });

})