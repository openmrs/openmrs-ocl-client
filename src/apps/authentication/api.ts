import { authenticatedInstance, unAuthenticatedInstance } from "../../api";

const api = {
  login: (username: string, password: string) =>
    unAuthenticatedInstance.post("/users/login/", { username, password }),
  getProfile: () => authenticatedInstance.get("/user/"),
  getUserOrgs: (username:string) => authenticatedInstance.get(`/users/${username}/orgs/?limit=0`)
};

export default api;
