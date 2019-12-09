import { authenticatedInstance } from "../../api";
import { AxiosResponse } from "axios";
import { BaseConcept, Mapping } from "./types";
import { buildPartialSearchQuery } from "../../utils";

// https://stackoverflow.com/a/40560953/6448384
const optionallyIncludeList = (key: string, value: string[]) =>
  value.length > 0 && { [key]: value.join(",") };

// timestamp here is to disable caching. response occasionally excluded headers when caching was turned on
const api = {
  retrievePublicSources: (page: number = 1, limit: number = 10, q = "") =>
    authenticatedInstance.get("/sources/", {
      params: {
        page,
        limit,
        q: buildPartialSearchQuery(q),
        verbose: true,
        timestamp: new Date().getTime()
      }
    }),
  concepts: {
    create: (
      sourceUrl: string,
      data: BaseConcept
    ): Promise<AxiosResponse<any>> =>
      authenticatedInstance.post(`${sourceUrl}concepts/`, data),
    retrieve: (
      conceptsUrl: string,
      page: number = 1,
      limit: number = 10,
      q = "",
      sortDirection = "sortAsc",
      sortBy = "bestMatch",
      dataTypeFilters = [],
      classFilters = []
    ) =>
      authenticatedInstance.get(conceptsUrl, {
        params: {
          page,
          limit,
          q: buildPartialSearchQuery(q),
          [sortDirection]: sortBy,
          ...optionallyIncludeList("datatype", dataTypeFilters),
          ...optionallyIncludeList("conceptClass", classFilters),
          timestamp: new Date().getTime()
        }
      })
  },
  concept: {
    retrieve: (conceptUrl: string): Promise<AxiosResponse<any>> =>
      authenticatedInstance.get(conceptUrl, {
        params: {
          verbose: true,
          includeMappings: true
        }
      }),
    update: (
      conceptUrl: string,
      data: BaseConcept
    ): Promise<AxiosResponse<any>> =>
      authenticatedInstance.put(conceptUrl, data)
  },
  mappings: {
    create: (sourceUrl: string, data: Mapping): Promise<AxiosResponse<any>> =>
      authenticatedInstance.post(`${sourceUrl}mappings/`, data)
  },
  mapping: {
    update: (mappingUrl: string, data: Mapping): Promise<AxiosResponse<any>> =>
      authenticatedInstance.put(mappingUrl, data)
  }
};

export default api;
