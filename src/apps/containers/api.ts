import { authenticatedInstance } from "../../api";

const api = {
  retrieve: (containerUrl: string) =>
    authenticatedInstance.get(containerUrl, {
      params: {
        verbose: true,
        includeReferences: true
      }
    }),
  versions: {
    retrieve: (containerUrl: string) =>
      authenticatedInstance.get(`${containerUrl}versions/`, {
        params: {
          verbose: true
        }
      })
  }
};

export default api;
