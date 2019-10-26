import {APISource} from "./types";
import {authenticatedInstance} from "../../api";
import {AxiosResponse} from "axios";

const api = {
    create: (ownerUrl: string, data: APISource): Promise<AxiosResponse<any>> => authenticatedInstance.post(`${ownerUrl}sources/`, data),
};

export default api;
