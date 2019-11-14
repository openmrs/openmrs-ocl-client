import {authenticatedInstance} from "../../api";
import {AxiosResponse} from "axios";
import { BaseConcept } from './types'
import { buildPartialSearchQuery } from '../../utils'

const api = {
  create: (sourceUrl: string, data: BaseConcept): Promise<AxiosResponse<any>> => authenticatedInstance.post(`${sourceUrl}/concepts/`, data),
  retrieve: (conceptUrl: string): Promise<AxiosResponse<any>> => authenticatedInstance.get(conceptUrl, {params: {verbose: true}}),
  retrievePublicSources: (page: number=1, limit: number=10, q='') => authenticatedInstance.get('/sources/', {params: {page, limit, q: buildPartialSearchQuery(q), verbose: true}}),
  retrieveConcepts: (sourceUrl: string, page: number=1, limit: number=10, q='') => authenticatedInstance.get(`${sourceUrl}/concepts/`, {params: {page, limit, q: buildPartialSearchQuery(q)}}),
};

export default api;
