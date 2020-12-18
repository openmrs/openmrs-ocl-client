import { authenticatedInstance } from "../../api";
import { Organisation } from './types';
import { AxiosResponse } from "axios";

const api = {
  getUserOrgs: (username:string) => authenticatedInstance.get(`/users/${username}/orgs/?sortDesc=lastUpdated`),
  retrieve: (username:string, q: string = "") => authenticatedInstance.get(`/users/${username}/orgs/?limit=0`, {
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