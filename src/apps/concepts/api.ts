import {authenticatedInstance} from "../../api";
import {AxiosResponse} from "axios";
import { Concept } from './types'

const api = {
  create: (sourceConceptsUrl: string, data: Concept): Promise<AxiosResponse<any>> => authenticatedInstance.post(sourceConceptsUrl, data),
  retrieve: (conceptUrl: string): Promise<AxiosResponse<any>> => authenticatedInstance.get(conceptUrl, {params: {verbose: true}}),
};

export default api;
