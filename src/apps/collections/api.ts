import { authenticatedInstance } from "../../api";
import { AxiosResponse } from "axios";
import { CIEL_SOURCE_URL } from "../../utils/constants";

const api = {
  retrieveCIELMappings: (
    fromConceptIds: string[]
  ): Promise<AxiosResponse<any>> =>
    authenticatedInstance.get(`${CIEL_SOURCE_URL}mappings/`, {
      params: {
        fromConcept: fromConceptIds.join(","),
        limit: 0
      }
    }), // todo optimize this
  references: {
    add: (
      collectionUrl: string,
      references: string[],
      cascade: string="sourcemappings",
    ): Promise<AxiosResponse<any>> =>
      authenticatedInstance.put(
        `${collectionUrl}references/`,
        { data: { expressions: references } },
        { params: { cascade: cascade } }
      ), // the nesting is not an error. Check API docs
    delete: (
      collectionUrl: string,
      references: string[]
    ): Promise<AxiosResponse<any>> =>
      authenticatedInstance.delete(`${collectionUrl}references/`, {
        data: references
      })
  }
};

export default api;
