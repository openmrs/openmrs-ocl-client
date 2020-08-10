import api from "../api";
import {authenticatedInstance, unAuthenticatedInstance} from "../../../api";

jest.mock("../../../api", () => ({
    authenticatedInstance: {
        put: jest.fn(),
        get: jest.fn(() => ({source: []})),
        post: jest.fn(),
    },
    unAuthenticatedInstance: {
        get: jest.fn(() => ({source: []})),
    }
}));

describe('api', () => {
    it('should make aunthenticated get call with given url and params', async () => {
        const url: string = "/user/sources/";
        const q: string = "";
        const limit: number = 20;
        const page: number = 1;
        const response = await api.sources.retrieve.private(url, q, limit, page);

        expect(authenticatedInstance.get).toHaveBeenCalledWith(url, {
            "params": {
                "limit": 20,
                "page": 1,
                "q": "*",
                "sourceType": "Dictionary",
                "timestamp": expect.anything()
            }
        });
        expect(response).toStrictEqual({source: []});

    });

    it('should make unauthenticated get call with given url and params', async () => {
        const url: string = "/sources/";
        const q: string = "";
        const limit: number = 20;
        const page: number = 1;
        const response = await api.sources.retrieve.public(url, q, limit, page);

        expect(unAuthenticatedInstance.get).toHaveBeenCalledWith(url, {
            "params": {
                "limit": 20,
                "page": 1,
                "q": "*",
                "sourceType": "Dictionary",
                "timestamp": expect.anything()
            }
        });
        expect(response).toStrictEqual({source: []});

    });
});
