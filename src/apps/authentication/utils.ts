import { AxiosResponse } from "axios";
import store from "../../redux/store";
// resist the temptation to make this like the rest of the action creators
// because of the potential of a circular dependency(auth/utils->api->auth/api->auth/redux/actions->auth->utils)
import { LOGOUT_ACTION } from "./redux";
import { AppState } from "../../redux";
import { USER_TYPE } from "../../utils";
import { APIOrg, APIProfile } from "./types";
import { action } from "../../redux/utils";

export const redirectIfNotLoggedIn = (response: AxiosResponse) => {
  if (response.status === 401) {
    store.dispatch(action(LOGOUT_ACTION));
  }
  return response;
};

export const addAuthToken = (data: any, headers?: any) => {
  headers["Authorization"] = `Token ${
    (store.getState() as AppState).auth.token
  }`;
  return data;
};

export const canModifyContainer = (
  ownerType: string,
  owner: string,
  profile?: APIProfile,
  usersOrgs: APIOrg[] = []
) =>
  Boolean(
    ownerType === USER_TYPE
      ? profile?.username === owner
      : usersOrgs.map(org => org.id).includes(owner)
  );
