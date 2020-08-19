
import {createActionThunk, indexedAction} from "../../../../redux";
import api from "../../api";
import {
    retrieveOrgSourcesAction,
    retrievePersonalSourcesAction,
    retrievePublicSourcesAction,
    makeRetrieveSourceAction
} from "../../redux/actions";

jest.mock("../../../../redux/", () => ({
        createActionThunk: jest.fn((indexedAction, retrieve) => {
        }),
        indexedAction: jest.fn((action, actionIndex) => ({actionType: action, actionIndex})),
    }
));

jest.mock('../../api', () => ({
    create: jest.fn(),
    update: jest.fn(),
    retrieve: jest.fn(),
    sources: {
        retrieve: {
            private: jest.fn(),
            public: jest.fn()
        }
    }
}));

describe('action', () => {

    it('for personal sources should use action index as 0 along with the corresponding actionType and api', () => {
        retrievePersonalSourcesAction;
        expect(createActionThunk).toHaveBeenCalledWith({
                actionIndex: 0,
                actionType: "sources/retrieveSources",
            }, api.sources.retrieve.private,
        );
        expect(indexedAction).toHaveBeenCalledWith("sources/retrieveSources", 0)
    });

    it('for org sources should use action index as 1 along with the corresponding actionType and api', () => {
        retrieveOrgSourcesAction;
        expect(createActionThunk).toHaveBeenCalledWith({
                actionIndex: 1,
                actionType: "sources/retrieveSources",
            }, api.sources.retrieve.private,
        );
        expect(indexedAction).toHaveBeenCalledWith("sources/retrieveSources", 1)
    });

    it('for public sources should use action index as 2 along with the corresponding actionType and api', () => {
        retrievePublicSourcesAction;
        expect(createActionThunk).toHaveBeenCalledWith({
                actionType: "sources/retrieveSources",
                actionIndex: 2,

            }, api.sources.retrieve.public,
        );
        expect(indexedAction).toHaveBeenCalledWith("sources/retrieveSources", 2)
    });

    it('for retrieving a source should pass corresponding actionType and api and useCache as false ', () => {
        makeRetrieveSourceAction(false);
        expect(createActionThunk).toHaveBeenCalledWith(
            "sources/retrieveSource", api.retrieve, false);
    });

    it('for retrieving a source should pass corresponding actionType and api and useCache as true ', () => {
        makeRetrieveSourceAction(true);
        expect(createActionThunk).toHaveBeenCalledWith(
            "sources/retrieveSource", api.retrieve, true);
    });

})

