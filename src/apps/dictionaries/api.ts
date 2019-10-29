import {APIDictionary} from "./types";
import {authenticatedInstance} from "../../api";
import {AxiosResponse} from "axios";

const api = {
    create: (ownerUrl: string, data: APIDictionary): Promise<AxiosResponse<any>> => authenticatedInstance.post(`${ownerUrl}collections/`, data),
    retrieve: (dictionaryUrl: string): Promise<AxiosResponse<any>> => authenticatedInstance.get(dictionaryUrl, {params: {verbose: true}}),
};

export default api;
