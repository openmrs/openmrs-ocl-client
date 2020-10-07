import { EditableSourceFields, NewAPISource, SourceVersion, APISourceVersion } from "./types";
import {authenticatedInstance, unAuthenticatedInstance} from "../../api";
import { AxiosResponse } from "axios";
import {
  buildPartialSearchQuery
} from "../../utils";
import { default as containerAPI } from "../containers/api";

const api = {
  ...containerAPI,
  create: (ownerUrl: string, data: NewAPISource): Promise<AxiosResponse<any>> =>
    authenticatedInstance.post(`${ownerUrl}sources/`, data),
  update: (
    sourceUrl: string,
    data: EditableSourceFields
  ): Promise<AxiosResponse<any>> => authenticatedInstance.put(sourceUrl, data),
  sources: {
    retrieve: {
      private: (
        sourcesUrl: string,
        q: string = "",
        limit = 20,
        page = 1
      ): Promise<AxiosResponse<any>> =>
        authenticatedInstance.get(sourcesUrl, {
          params: {
            limit,
            page,
            q: buildPartialSearchQuery(q),
            timestamp: new Date().getTime(), // work around seemingly unhelpful caching
          },
        }),
        public: (
            sourcesUrl: string,
            q: string = "",
            limit = 20,
            page = 1
        ): Promise<AxiosResponse<any>> =>
            unAuthenticatedInstance.get(sourcesUrl, {
                params: {
                    limit,
                    page,
                    q: buildPartialSearchQuery(q),
                    timestamp: new Date().getTime() // work around seemingly unhelpful caching
                }
            }),
    },
  },versions: {
    retrieve: (sourceUrl: string): Promise<AxiosResponse<any>> =>
      authenticatedInstance.get(`${sourceUrl}versions/?verbose=true`),
    create: (
      sourceUrl: string,
      data: SourceVersion
    ): Promise<AxiosResponse<APISourceVersion>> =>
      authenticatedInstance.post(`${sourceUrl}versions/`, data),
    update: (
      sourceUrl: string,
      data: SourceVersion
    ): Promise<AxiosResponse<APISourceVersion>> =>
        authenticatedInstance.put(`${sourceUrl}${data.id}/`, data)
  },
};

export default api;
