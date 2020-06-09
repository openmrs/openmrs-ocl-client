import { NewAPISource } from "./types";
import { authenticatedInstance } from "../../api";
import { AxiosResponse } from "axios";
import { EditableConceptContainerFields } from "../../utils";
import { default as containerAPI } from "../containers/api";

const api = {
  ...containerAPI,
  create: (ownerUrl: string, data: NewAPISource): Promise<AxiosResponse<any>> =>
    authenticatedInstance.post(`${ownerUrl}sources/`, data),
  update: (
    sourceUrl: string,
    data: EditableConceptContainerFields
  ): Promise<AxiosResponse<any>> => authenticatedInstance.put(sourceUrl, data),
  retrieve: (sourceUrl: string): Promise<AxiosResponse<any>> =>
    authenticatedInstance.get(sourceUrl, { params: { verbose: true } })
};

export default api;
