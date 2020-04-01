import {
  APIDictionaryVersion,
  DictionaryVersion,
  EditableDictionaryFields,
  NewAPIDictionary
} from "./types";
import { authenticatedInstance, unAuthenticatedInstance } from "../../api";
import { AxiosResponse } from "axios";
import { OCL_DICTIONARY_TYPE } from "./constants";
import { buildPartialSearchQuery, CUSTOM_VALIDATION_SCHEMA } from "../../utils";

const api = {
  create: (
    ownerUrl: string,
    data: NewAPIDictionary
  ): Promise<AxiosResponse<any>> =>
    authenticatedInstance.post(`${ownerUrl}collections/`, data),
  retrieve: (dictionaryUrl: string): Promise<AxiosResponse<any>> =>
    authenticatedInstance.get(dictionaryUrl, { params: { verbose: true } }),
  update: (
    dictionaryUrl: string,
    data: EditableDictionaryFields
  ): Promise<AxiosResponse<any>> =>
    authenticatedInstance.put(dictionaryUrl, data),
  dictionaries: {
    retrieve: {
      public: (
        dictionariesUrl: string,
        q: string = "",
        limit = 20,
        page = 1
      ): Promise<AxiosResponse<any>> =>
        unAuthenticatedInstance.get(dictionariesUrl, {
          params: {
            limit,
            page,
            q: buildPartialSearchQuery(q),
            collection_type: OCL_DICTIONARY_TYPE,
            customValidationSchema: CUSTOM_VALIDATION_SCHEMA,
            timestamp: new Date().getTime() // work around seemingly unhelpful caching
          }
        }),
      private: (
        dictionariesUrl: string,
        q: string = "",
        limit = 20,
        page = 1
      ): Promise<AxiosResponse<any>> =>
        authenticatedInstance.get(dictionariesUrl, {
          params: {
            limit,
            page,
            q: buildPartialSearchQuery(q),
            collection_type: OCL_DICTIONARY_TYPE,
            customValidationSchema: CUSTOM_VALIDATION_SCHEMA,
            timestamp: new Date().getTime() // work around seemingly unhelpful caching
          }
        })
    }
  },
  versions: {
    retrieve: (dictionaryUrl: string): Promise<AxiosResponse<any>> =>
      authenticatedInstance.get(`${dictionaryUrl}versions/`),
    create: (
      dictionaryUrl: string,
      data: DictionaryVersion
    ): Promise<AxiosResponse<APIDictionaryVersion>> =>
      authenticatedInstance.post(`${dictionaryUrl}versions/`, data)
  },
  retrieveMappings: (
    sourceUrl: string,
    fromConceptIds: string[]
  ): Promise<AxiosResponse<any>> =>
    authenticatedInstance.get(`${sourceUrl}mappings/`, {
      params: {
        fromConcept: fromConceptIds.join(","),
        limit: 0 // bad, todo optimize this
      }
    }),
  references: {
    add: (
      dictionaryUrl: string,
      references: string[],
      cascade: string = "sourcemappings"
    ): Promise<AxiosResponse<any>> =>
      authenticatedInstance.put(
        `${dictionaryUrl}references/`,
        { data: { expressions: references } }, // the nesting is not an error. Check API docs
        { params: { cascade: cascade } }
      ),
    delete: (
      dictionaryUrl: string,
      references: string[],
      cascade: string = "sourcemappings"
    ): Promise<AxiosResponse<any>> =>
      authenticatedInstance.delete(`${dictionaryUrl}references/`, {
        data: { references: references }, // again, Check the API docs
        params: { cascade: cascade }
      })
  }
};

export default api;
