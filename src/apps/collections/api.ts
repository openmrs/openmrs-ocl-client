import {APICollection} from "./types";
import {authenticatedInstance} from "../../api";
import {AxiosResponse} from "axios";

const api = {
    create: (ownerUrl: string, data: APICollection): Promise<AxiosResponse<any>> => authenticatedInstance.post(`${ownerUrl}collections/`, data),
};

export default api;
