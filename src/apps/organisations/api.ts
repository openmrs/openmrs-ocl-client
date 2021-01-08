import { authenticatedInstance } from "../../api";
import { Organisation, EditableOrganisationFields } from './types';
import { AxiosResponse } from "axios";

const api = {
  getUserOrgs: (username:string) => authenticatedInstance.get(`/users/${username}/orgs/?sortDesc=lastUpdated`),
  retrieve: {
    all: (
      username:string, 
      q: string = "", 
      limit = 20,
      page = 1
      ) => authenticatedInstance.get(`/users/${username}/orgs/`, {
    params: {
      limit,
      page,
      q
    }
  })
},
  create: (
    data: Organisation
  ): Promise<AxiosResponse<any>> =>
    authenticatedInstance.post(`/orgs/`, data),
organisation : {
  retrieve: (url: string) => authenticatedInstance.get(url) ,
  update: (orgUrl: string, data: EditableOrganisationFields): Promise<AxiosResponse<any>> =>
      authenticatedInstance.post(orgUrl, data),
  delete: (orgUrl: string): Promise<AxiosResponse<any>> =>
      authenticatedInstance.delete(orgUrl),
  retrieveSources: (orgUrl: string):Promise<AxiosResponse<any>> =>
      authenticatedInstance.get(`${orgUrl}sources/`),
  retrieveCollections: (orgUrl: string):Promise<AxiosResponse<any>> =>
      authenticatedInstance.get(`${orgUrl}collections/`)
},
  
};

export default api;