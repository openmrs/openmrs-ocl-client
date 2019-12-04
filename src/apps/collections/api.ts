import { NewAPICollection } from './types'
import { authenticatedInstance } from '../../api'
import { AxiosResponse } from 'axios'
import { EditableConceptContainerFields } from '../../utils'

const api = {
  create: (ownerUrl: string, data: NewAPICollection): Promise<AxiosResponse<any>> => authenticatedInstance.post(`${ownerUrl}collections/`, data),
  update: (collectionUrl: string, data: EditableConceptContainerFields): Promise<AxiosResponse<any>> => authenticatedInstance.put(collectionUrl, data),
  retrieve: (collectionUrl: string): Promise<AxiosResponse<any>> => authenticatedInstance.get(collectionUrl, { params: { verbose: true } }),
}

export default api
