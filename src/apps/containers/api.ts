import { authenticatedInstance } from "../../api";

const api = {
  retrieve: (containerUrl: string) =>
    authenticatedInstance.get(containerUrl, { params: { verbose: true } })
};

export default api;
