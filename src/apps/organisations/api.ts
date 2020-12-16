import { authenticatedInstance } from "../../api";
import { Organisation } from './types';
import { AxiosResponse } from "axios";

const api = {
  getProfile: () => authenticatedInstance.get("/user/"),
  getUserOrgs: (username:string) => authenticatedInstance.get(`/users/${username}/orgs/?sortDesc=lastUpdated`),
  retrieve: (username:string, q: string = "") => authenticatedInstance.get(`/users/${username}/orgs/`, {
    params: {
      q
    }
  }),
  create: (
    data: Organisation
  ): Promise<AxiosResponse<any>> =>
    authenticatedInstance.post(`/orgs/`, data),
};

export default api;