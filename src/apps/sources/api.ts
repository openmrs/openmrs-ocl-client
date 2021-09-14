import {
  EditableSourceFields,
  NewAPISource,
  SourceVersion,
  APISourceVersion
} from "./types";
import { authenticatedInstance, unAuthenticatedInstance } from "../../api";
import { AxiosResponse } from "axios";
import { buildPartialSearchQuery } from "../../utils";
import { default as containerAPI } from "../containers/api";

const api = {
  ...containerAPI,
  create: (ownerUrl: string, data: NewAPISource) =>
    authenticatedInstance.post(`${ownerUrl}sources/`, data),
  update: (sourceUrl: string, data: EditableSourceFields) =>
    authenticatedInstance.put(sourceUrl, data),
  sources: {
    retrieve: {
      private: (
        sourcesUrl: string,
        q: string = "",
        limit = 20,
        page = 1,
        verbose = true
      ) =>
        authenticatedInstance.get(sourcesUrl, {
          params: {
            limit,
            page,
            verbose: true,
            q: buildPartialSearchQuery(q),
            timestamp: new Date().getTime() // work around seemingly unhelpful caching
          }
        }),
      public: (
        sourcesUrl: string,
        q: string = "",
        limit = 20,
        page = 1,
        verbose = true
      ) =>
        unAuthenticatedInstance.get(sourcesUrl, {
          params: {
            limit,
            page,
            verbose: true,
            q: buildPartialSearchQuery(q),
            timestamp: new Date().getTime() // work around seemingly unhelpful caching
          }
        })
    }
  },
  versions: {
    ...containerAPI.versions,
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
  }
};

export default api;
