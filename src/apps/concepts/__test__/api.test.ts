import {authenticatedInstance, unAuthenticatedInstance} from "../../../api";
import {APIConcept} from "../types";
import api from "../api";

const testConcept: APIConcept = {
    display_name: "testConcept",
    url: "url",
    version_url: "versionUrl",
    mappings: [],
    retired: false,
    source_url: "sourceUrl",
    id: "testId",
    external_id: "extId",
    concept_class: "",
    datatype: "TEXT",
    names: [],
    descriptions: [],
    extras: {}
};
jest.mock("../../../api", () => ({
    authenticatedInstance: {
        put: jest.fn(),
        get: jest.fn(() => ({activeConcepts: {
                display_name: "testConcept",
                url: "url",
                version_url: "versionUrl",
                mappings: [],
                retired: false,
                source_url: "sourceUrl",
                id: "testId",
                external_id: "extId",
                concept_class: "",
                datatype: "TEXT",
                names: [],
                descriptions: [],
                extras: {}
            }
        })),
        post: jest.fn(),
    },
    unAuthenticatedInstance: {
        get: jest.fn(() => ({activeConcepts: []})),
    }
}));

describe('api', () => {
    const conceptsUrl: string = "/user/concepts/";
    const page: number = 1;
    const limit: number = 1;
    const q: string = "";
    const sortDirection: string = "sortAsc";
    const sortBy: string = "bestMatch";
    const dataTypeFilters: string[] = [];
    const classFilters: string[] = [];
    const sourceFilters: string[] = [];

   it('should make authenticated get call with given url and params to get active concepts', async() => {
        await api.concepts.retrieveActive({
            conceptsUrl: conceptsUrl,
            page: page,
            limit: limit,
            q: q,
            sortDirection: sortDirection,
            sortBy: sortBy,
            dataTypeFilters: dataTypeFilters,
            classFilters: classFilters,
            sourceFilters: sourceFilters
        });
        expect(authenticatedInstance.get).toHaveBeenCalledWith(conceptsUrl, {
            "params": {
                "limit": 1,
                "page": 1,
                "q": "*",
                "sortAsc": "bestMatch",
                "timestamp": expect.anything()
            }
        });
    });

    it('should return testConcept if authenticated get call is made to get active concepts', async() => {
        const response = await api.concepts.retrieveActive({
            conceptsUrl: conceptsUrl,
            page: page,
            limit: limit,
            q: q,
            sortDirection: sortDirection,
            sortBy: sortBy,
            dataTypeFilters: dataTypeFilters,
            classFilters: classFilters,
            sourceFilters: sourceFilters
        });
        expect(response).toStrictEqual({activeConcepts: testConcept});
    });

    it('should not be able to make unauthenticated get call to get active concepts', async() => {
        expect(unAuthenticatedInstance.get).not.toHaveBeenCalledWith(conceptsUrl);
    });
});
