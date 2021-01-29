import { authenticatedInstance, unAuthenticatedInstance } from "../../api";
import { Organisation, EditableOrganisationFields, OrgMember } from './types';
import { buildPartialSearchQuery, CUSTOM_VALIDATION_SCHEMA } from "../../utils";
import { AxiosResponse } from "axios";

const api = {
  organisations: {
    retrieve: {
      public: (
        organisationUrl: string,
        q: string = "",
        limit = 20,
        page = 1
      ): Promise<AxiosResponse<any>> =>
        unAuthenticatedInstance.get(organisationUrl, {
          params: {
            limit,
            page,
            verbose: true,
            q: buildPartialSearchQuery(q),
            customValidationSchema: CUSTOM_VALIDATION_SCHEMA,
            sortAsc: 'name',
            timestamp: new Date().getTime()
          }
        }),
      private: (
        organisationUrl: string,
        q: string = "",
        limit = 20,
        page = 1
      ): Promise<AxiosResponse<any>> =>
        authenticatedInstance.get(organisationUrl, {
          params: {
            limit,
            page,
            verbose: true,
            q: buildPartialSearchQuery(q),
            customValidationSchema: CUSTOM_VALIDATION_SCHEMA,
            sortAsc: 'name',
            timestamp: new Date().getTime() // work around seemingly unhelpful caching
          }
        })
    }
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
        authenticatedInstance.get(`${orgUrl}collections/`),
    retrieveMembers: (orgUrl: string):Promise<AxiosResponse<any>> =>
        authenticatedInstance.get(`${orgUrl}members/`),
    addMember: (orgUrl: string, member: OrgMember):Promise<AxiosResponse<any>> =>
        authenticatedInstance.put(`${orgUrl}members/${member.username}`),
    deleteMember: (orgUrl: string, user:string): Promise<AxiosResponse<any>> =>
        authenticatedInstance.delete(`${orgUrl}members/${user}`)
  },
  
};

export default api;
