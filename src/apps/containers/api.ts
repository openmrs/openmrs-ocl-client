import { authenticatedInstance } from "../../api";
import { AxiosResponse } from "axios";

const api = {
  retrieve: (containerUrl: string): Promise<AxiosResponse<any>> =>
    authenticatedInstance.get(containerUrl, { params: { verbose: true } })
};

export default api;
