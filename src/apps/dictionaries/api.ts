import {APIDictionary} from "./types";
import {authenticatedInstance} from "../../api";
import {AxiosResponse} from "axios";

const api = {
    create: (ownerUrl: string, data: APIDictionary): Promise<AxiosResponse<any>> => authenticatedInstance.post(`${ownerUrl}collections/`, data),
};

export default api;
