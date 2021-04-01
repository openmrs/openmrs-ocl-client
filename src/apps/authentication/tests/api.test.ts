import { authenticatedInstance, unAuthenticatedInstance } from "../../../api";
import api from "../api";

jest.mock("../../../api", () => ({
  authenticatedInstance: {
    put: jest.fn(),
    get: jest.fn(() => ({
      userOrgs: [{ id: "OCL", name: "Open Concept Lab", url: "/orgs/OCL/" }]
    })),
    post: jest.fn()
  },
  unAuthenticatedInstance: {
    get: jest.fn(() => ({ userOrgs: [] }))
  }
}));

describe("api", () => {
  it("should make authenticated get call with given url and params", async () => {
    const url: string = "/users/root/orgs/?limit=0";
    const username: string = "root";
    const response = api.getUserOrgs(username);

    expect(authenticatedInstance.get).toHaveBeenCalledWith(url);
    expect(response).toStrictEqual({
      userOrgs: [{ id: "OCL", name: "Open Concept Lab", url: "/orgs/OCL/" }]
    });
  });

  it("should make unauthenticated get call with given url and params", async () => {
    const url: string = "/users/root/orgs/?limit=0";
    const response = unAuthenticatedInstance.get(url);

    expect(unAuthenticatedInstance.get).toHaveBeenCalledWith(url);
    expect(response).toStrictEqual({ userOrgs: [] });
  });
});
