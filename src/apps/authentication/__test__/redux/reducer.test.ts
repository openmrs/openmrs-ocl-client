import { LOGOUT_ACTION } from "../../redux/actionTypes";
import { AuthState } from "../../types";
import reducer from "../../redux/reducer";
import { AnyAction } from "redux";

const logoutAuthState: AuthState = { isLoggedIn: false, token: undefined };
const currentState: AuthState = {
  isLoggedIn: true,
  profile: {
    username: "test",
    email: "test@test.com"
  },
  orgs: [
    {
      id: "OCL",
      name: "Open Concept Lab",
      url: "/orgs/OCL/"
    },
    {
      id: "CIEL",
      name: "CIEL",
      url: "/orgs/CIEL/"
    }
  ],
  token: "1234567890"
};
describe("auth reducer on logout action", () => {
  it("should return auth state only with isLoggedIn as false on logout action ", () => {
    const logoutAction: AnyAction = {
      type: LOGOUT_ACTION,
      actionIndex: 0,
      payload: []
    };
    expect(reducer(currentState, logoutAction)).toEqual(logoutAuthState);
  });
});
