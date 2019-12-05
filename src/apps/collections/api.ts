import { NewAPICollection } from './types'
import { authenticatedInstance } from '../../api'
import { AxiosResponse } from 'axios'
import { EditableConceptContainerFields } from '../../utils'
import { CIEL_SOURCE_URL } from '../../utils/constants'

const api = {
  create: (ownerUrl: string, data: NewAPICollection): Promise<AxiosResponse<any>> => authenticatedInstance.post(`${ownerUrl}collections/`, data),
  update: (collectionUrl: string, data: EditableConceptContainerFields): Promise<AxiosResponse<any>> => authenticatedInstance.put(collectionUrl, data),
  retrieve: (collectionUrl: string): Promise<AxiosResponse<any>> => authenticatedInstance.get(collectionUrl, { params: { verbose: true } }),
  retrieveCIELMappings: (fromConceptIds: string[]): Promise<AxiosResponse<any>> => authenticatedInstance.get(`${CIEL_SOURCE_URL}mappings/`, {
    params: {
      fromConcept: fromConceptIds.join(','),
      limit: 0
    }
  }), // todo optimize this
  references: {
    add: (collectionUrl: string, references: string[]): Promise<AxiosResponse<any>> => authenticatedInstance.put(`${collectionUrl}references/`, { data: { expressions: references } }, { params: { cascade: 'sourcemappings' } }), // the nesting is not an error. Check API docs
    delete: (collectionUrl: string, references: string[]): Promise<AxiosResponse<any>> => authenticatedInstance.delete(`${collectionUrl}references/`, { data: references }),
  },
}

export default api
