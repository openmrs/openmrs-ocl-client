import { EditableDictionaryFields, NewAPIDictionary } from "./types";
import { authenticatedInstance, unAuthenticatedInstance } from "../../api";
import { AxiosResponse } from "axios";
import { OCL_DICTIONARY_TYPE } from "./constants";
import { buildPartialSearchQuery, CUSTOM_VALIDATION_SCHEMA } from "../../utils";
import { CIEL_SOURCE_URL } from '../../utils/constants'

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
            timestamp: new Date().getTime()
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
            timestamp: new Date().getTime()
          }
        })
    }
  },
  versions: {
    retrieve: (dictionaryUrl: string): Promise<AxiosResponse<any>> =>
      authenticatedInstance.get(`${dictionaryUrl}versions/`)
  },
  retrieveCIELMappings: (
    fromConceptIds: string[]
  ): Promise<AxiosResponse<any>> =>
    authenticatedInstance.get(`${CIEL_SOURCE_URL}mappings/`, {
      params: {
        fromConcept: fromConceptIds.join(","),
        limit: 0
      }
    }), // todo optimize this
  references: {
    add: (
      collectionUrl: string,
      references: string[],
      cascade: string="sourcemappings",
    ): Promise<AxiosResponse<any>> =>
      authenticatedInstance.put(
        `${collectionUrl}references/`,
        { data: { expressions: references } },
        { params: { cascade: cascade } }
      ), // the nesting is not an error. Check API docs
    delete: (
      collectionUrl: string,
      references: string[]
    ): Promise<AxiosResponse<any>> =>
      authenticatedInstance.delete(`${collectionUrl}references/`, {
        data: references
      })
  }
};

export default api;
