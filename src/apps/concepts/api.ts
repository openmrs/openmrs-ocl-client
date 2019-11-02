import {authenticatedInstance} from "../../api";
import {AxiosResponse} from "axios";
import { Concept } from './types'
import { buildPartialSearchQuery } from '../../utils'

const api = {
  create: (sourceConceptsUrl: string, data: Concept): Promise<AxiosResponse<any>> => authenticatedInstance.post(sourceConceptsUrl, data),
  retrieve: (conceptUrl: string): Promise<AxiosResponse<any>> => authenticatedInstance.get(conceptUrl, {params: {verbose: true}}),
  retrievePublicSources: (page: number=1, limit: number=10, q='') => authenticatedInstance.get('/sources/', {params: {page, limit, q: buildPartialSearchQuery(q)}})
};

export default api;
