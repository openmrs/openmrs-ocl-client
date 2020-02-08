import { AxiosResponse } from "axios";
import store from "../../store";
// resist the temptation to make this like the rest of the action creators
// because of the potential of a circular dependency(auth/utils->api->auth/api->auth/redux/actions->auth->utils)
import { LOGOUT_ACTION } from "./redux";
import { AppState } from "../../redux";
import { USER_TYPE } from "../../utils/constants";
import { APIOrg, APIProfile } from "./types";
import { action } from '../../redux/utils'

const redirectIfNotLoggedIn = (response: AxiosResponse) => {
  if (response.status === 401) {
    store.dispatch(action(LOGOUT_ACTION));
  }
  return response;
};

const addAuthToken = (data: any, headers: any) => {
  headers["Authorization"] = `Token ${
    (store.getState() as AppState).auth.token
  }`;
  return data;
};

const canModifyContainer = (
  ownerType: string,
  owner: string,
  profile?: APIProfile,
  usersOrgs: APIOrg[] = []
) =>
  Boolean(
    ownerType === USER_TYPE
      ? profile?.username === owner
      : profile?.username &&
          usersOrgs.map(org => org.id).indexOf(profile.username) > -1
  );

export { redirectIfNotLoggedIn, addAuthToken, canModifyContainer };
