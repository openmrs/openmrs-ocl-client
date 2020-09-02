import { NewAPISource } from "./types";
import {authenticatedInstance, unAuthenticatedInstance} from "../../api";
import { AxiosResponse } from "axios";
import {
  buildPartialSearchQuery,
  EditableConceptContainerFields,
} from "../../utils";
import { default as containerAPI } from "../containers/api";

const api = {
  ...containerAPI,
  create: (ownerUrl: string, data: NewAPISource): Promise<AxiosResponse<any>> =>
    authenticatedInstance.post(`${ownerUrl}sources/`, data),
  update: (
    sourceUrl: string,
    data: EditableConceptContainerFields
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
  },
};

export default api;
