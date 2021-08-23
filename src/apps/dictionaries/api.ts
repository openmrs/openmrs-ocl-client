import {
  APIDictionary,
  APIDictionaryVersion,
  DictionaryVersion,
  EditableDictionaryFields,
  NewAPIDictionary
} from "./types";
import { authenticatedInstance, unAuthenticatedInstance } from "../../api";
import { AxiosResponse } from "axios";
import { buildPartialSearchQuery, CUSTOM_VALIDATION_SCHEMA } from "../../utils";
import { default as containerAPI } from "../containers/api";

const api = {
  ...containerAPI,
  create: (ownerUrl: string, data: NewAPIDictionary) =>
    authenticatedInstance.post(`${ownerUrl}collections/`, data),
  update: (dictionaryUrl: string, data: EditableDictionaryFields) =>
    authenticatedInstance.put(dictionaryUrl, data),
  dictionaries: {
    retrieve: {
      public: (dictionariesUrl: string, q: string = "", limit = 20, page = 1) =>
        unAuthenticatedInstance.get<APIDictionary>(dictionariesUrl, {
          params: {
            limit,
            page,
            verbose: true,
            q: buildPartialSearchQuery(q),
            customValidationSchema: CUSTOM_VALIDATION_SCHEMA,
            timestamp: new Date().getTime() // work around seemingly unhelpful caching
          }
        }),
      private: (
        dictionariesUrl: string,
        q: string = "",
        limit = 20,
        page = 1
      ) =>
        authenticatedInstance.get<APIDictionary>(dictionariesUrl, {
          params: {
            limit,
            page,
            verbose: true,
            q: buildPartialSearchQuery(q),
            customValidationSchema: CUSTOM_VALIDATION_SCHEMA,
            timestamp: new Date().getTime() // work around seemingly unhelpful caching
          }
        })
    }
  },
  versions: {
    ...containerAPI.versions,
    create: (
      dictionaryUrl: string,
      data: DictionaryVersion
    ): Promise<AxiosResponse<APIDictionaryVersion>> =>
      authenticatedInstance.post(`${dictionaryUrl}versions/`, data),
    update: (
      dictionaryUrl: string,
      data: DictionaryVersion
    ): Promise<AxiosResponse<APIDictionaryVersion>> =>
      authenticatedInstance.put(`${dictionaryUrl}${data.id}/`, data)
  },
  retrieveMappings: (dictionaryUrl: string, fromConceptIds: string[]) =>
    authenticatedInstance.get(`${dictionaryUrl}mappings/`, {
      params: {
        fromConcept: fromConceptIds.join(","),
        limit: 0 // bad, todo optimize this
      }
    }),
  references: {
    add: (
      dictionaryUrl: string,
      references?: string[],
      cascade: string = "sourcemappings"
    ) =>
      authenticatedInstance.put(
        `${dictionaryUrl}references/`,
        { data: { expressions: references } }, // the nesting is not an error. Check API docs
        { params: { cascade: cascade } }
      ),
    delete: (
      dictionaryUrl: string,
      references: string[],
      cascade: string = "sourcemappings"
    ) =>
      authenticatedInstance.delete(`${dictionaryUrl}references/`, {
        data: { references: references }, // again, Check the API docs
        params: { cascade: cascade }
      })
  }
};

export default api;
