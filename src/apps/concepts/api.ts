import { authenticatedInstance } from "../../api";
import { BaseConcept, Mapping } from "./types";
import { buildPartialSearchQuery } from "../../utils";

const optionallyIncludeList = (key: string, value: string[]) =>
  // https://stackoverflow.com/a/40560953/6448384
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
    ) =>
      authenticatedInstance.post(`${sourceUrl}concepts/`, data),
    retrieve: (
        retrieveParams: {
            conceptsUrl?: string;
            page?: number;
            limit?: number;
            q?: string;
            sortDirection?: string;
            sortBy?: string;
            dataTypeFilters?: string[];
            classFilters?: string[];
            sourceFilters?: string[];
            includeRetired?: boolean;
        }
    ) => {
        const {
            conceptsUrl="#",
            page = 1,
            limit = 10,
            q = "",
            sortDirection = "sortAsc",
            sortBy = "bestMatch",
            dataTypeFilters = [] as string[],
            classFilters = [] as string[],
            sourceFilters = [] as string[],
            includeRetired = false
        } = retrieveParams;
        return authenticatedInstance.get(conceptsUrl, {
            params: {
                page,
                limit,
                q: buildPartialSearchQuery(q),
                [sortDirection]: sortBy,
                ...optionallyIncludeList("datatype", dataTypeFilters),
                ...optionallyIncludeList("conceptClass", classFilters),
                ...optionallyIncludeList("source", sourceFilters),
                timestamp: new Date().getTime(),
                includeRetired
            }
        })
      },
    retrieveActive: (
        retrieveActiveParams: {
            conceptsUrl?: string;
            page?: number;
            limit?: number;
            q?: string;
            sortDirection?: string;
            sortBy?: string;
            dataTypeFilters?: string[];
            classFilters?: string[];
            sourceFilters?: string[];
            includeRetired?: boolean;
        }
    ) =>{
        const {
            conceptsUrl="#",
            page = 1,
            limit = 10,
            q = "",
            sortDirection = "sortAsc",
            sortBy = "bestMatch",
            dataTypeFilters = [] as string[],
            classFilters = [] as string[],
            sourceFilters = [] as string[]
        } = retrieveActiveParams;
        return authenticatedInstance.get(conceptsUrl, {
            params: {
                page,
                limit,
                q: buildPartialSearchQuery(q),
                [sortDirection]: sortBy,
                ...optionallyIncludeList("datatype", dataTypeFilters),
                ...optionallyIncludeList("conceptClass", classFilters),
                ...optionallyIncludeList("source", sourceFilters),
                timestamp: new Date().getTime()
            }
        })
    }
  },
  concept: {
    retrieve: (conceptUrl: string) =>
      authenticatedInstance.get(conceptUrl, {
        params: {
          verbose: true,
          includeMappings: true
        }
      }),
    update: (
      conceptUrl: string,
      data: BaseConcept
    ) =>
      authenticatedInstance.put(conceptUrl, data)
  },
  mappings: {
    create: (sourceUrl: string, data: Mapping) =>
      authenticatedInstance.post(`${sourceUrl}mappings/`, data)
  },
  mapping: {
    update: (mappingUrl: string, data: Mapping) =>
      authenticatedInstance.put(mappingUrl, data)
  }
};

export default api;
