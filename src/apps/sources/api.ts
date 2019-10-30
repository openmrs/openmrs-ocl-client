import {NewAPISource} from "./types";
import {authenticatedInstance} from "../../api";
import {AxiosResponse} from "axios";

const api = {
    create: (ownerUrl: string, data: NewAPISource): Promise<AxiosResponse<any>> => authenticatedInstance.post(`${ownerUrl}sources/`, data),
    retrieve: (sourceUrl: string): Promise<AxiosResponse<any>> => authenticatedInstance.get(sourceUrl, {params: {verbose: true}}),
};

export default api;
