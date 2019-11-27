import { NewAPIDictionary } from './types'
import { authenticatedInstance, unAuthenticatedInstance } from '../../api'
import { AxiosResponse } from 'axios'
import { OCL_DICTIONARY_TYPE } from './constants'
import { buildPartialSearchQuery, CUSTOM_VALIDATION_SCHEMA } from '../../utils'

const api = {
  create: (ownerUrl: string, data: NewAPIDictionary): Promise<AxiosResponse<any>> => authenticatedInstance.post(`${ownerUrl}collections/`, data),
  retrieve: (dictionaryUrl: string): Promise<AxiosResponse<any>> => authenticatedInstance.get(dictionaryUrl, { params: { verbose: true } }),
  dictionaries: {
    retrieve: {
      public: (dictionariesUrl: string, q: string = '', limit = 20, page = 1): Promise<AxiosResponse<any>> => unAuthenticatedInstance.get(dictionariesUrl,
        {
          params: {
            limit,
            page,
            verbose: true,
            q: buildPartialSearchQuery(q),
            collection_type: OCL_DICTIONARY_TYPE,
            customValidationSchema: CUSTOM_VALIDATION_SCHEMA,
            timestamp: new Date().getTime(),
          }
        }
      ),
      private: (dictionariesUrl: string, q: string = '', limit = 20, page = 1): Promise<AxiosResponse<any>> => authenticatedInstance.get(dictionariesUrl,
        {
          params: {
            limit,
            page,
            verbose: true,
            q: buildPartialSearchQuery(q),
            collection_type: OCL_DICTIONARY_TYPE,
            customValidationSchema: CUSTOM_VALIDATION_SCHEMA,
            timestamp: new Date().getTime()
          }
        }
      ),
    }
  },
}

export default api
