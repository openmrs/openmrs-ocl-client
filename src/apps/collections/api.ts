import { NewAPICollection } from './types'
import { authenticatedInstance } from '../../api'
import { AxiosResponse } from 'axios'
import { EditableConceptContainerFields } from '../../utils'
import { CIEL_SOURCE_URL } from '../../utils/constants'

const api = {
  create: (ownerUrl: string, data: NewAPICollection): Promise<AxiosResponse<any>> => authenticatedInstance.post(`${ownerUrl}collections/`, data),
  update: (collectionUrl: string, data: EditableConceptContainerFields): Promise<AxiosResponse<any>> => authenticatedInstance.put(collectionUrl, data),
  retrieve: (collectionUrl: string): Promise<AxiosResponse<any>> => authenticatedInstance.get(collectionUrl, { params: { verbose: true } }),
  retrieveCIELMappings: (fromConcepts: string[]): Promise<AxiosResponse<any>> => authenticatedInstance.get(`${CIEL_SOURCE_URL}mappings/?fromConcept=${fromConcepts.join(',')}&limit=0`),
}

export default api
