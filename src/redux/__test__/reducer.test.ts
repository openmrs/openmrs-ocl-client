import { LOGOUT_ACTION } from "../../apps/authentication/redux/actionTypes";
import loadingAndErroredReducer from "../reducer";
import { LoadingAndErroredState } from "../types";

const initialState = {};
const currentState: LoadingAndErroredState = {
  "authentication/getUserOrgsMeta": [["root"]]
};
describe("reducer on logout action", () => {
  it("should return empty status state on logout action ", () => {
    const logoutAction = {
      type: LOGOUT_ACTION,
      actionIndex: 0,
      payload: []
    };
    //@ts-ignore
    expect(loadingAndErroredReducer(currentState, logoutAction)).toEqual(
      initialState
    );
  });
});
