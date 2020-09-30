import {errorSelector, indexedAction, loadingSelector} from "../../../../redux";
import {
    createSourceErrorSelector,
    createSourceLoadingSelector,
    retrieveOrgSourcesLoadingSelector,
    retrievePersonalSourcesLoadingSelector,
    retrievePublicSourcesLoadingSelector,
    retrieveSourceErrorSelector,
    retrieveSourceLoadingSelector,
    sourceSelector
} from "../../redux/selectors";
import {currentState, testSource} from "../test_data";
import {SourceState} from "../../types";

jest.mock("../../../../redux/", () => ({
        loadingSelector: jest.fn((indexedAction) => {
        }),
        errorSelector: jest.fn((actionType) => {
        }),
        indexedAction: jest.fn((action, actionIndex) => ({actionType: action, actionIndex})),
    }
));

describe('selector', () => {

    it('for loading personal sources should pass action index as 0 along with the corresponding actionType', () => {
        retrievePersonalSourcesLoadingSelector;
        expect(loadingSelector).toHaveBeenCalledWith({
            actionType: "sources/retrieveSources",
            actionIndex: 0
        });
        expect(indexedAction).toHaveBeenCalledWith("sources/retrieveSources", 0)
    });

    it('for loading personal sources should pass action index as 1 along with the corresponding actionType', () => {
        retrieveOrgSourcesLoadingSelector;
        expect(loadingSelector).toHaveBeenCalledWith({
            actionType: "sources/retrieveSources",
            actionIndex: 1
        });
        expect(indexedAction).toHaveBeenCalledWith("sources/retrieveSources", 1)
    });

    it('for loading personal sources should pass action index as 2 along with the corresponding actionType', () => {
        retrievePublicSourcesLoadingSelector;
        expect(loadingSelector).toHaveBeenCalledWith({
            actionType: "sources/retrieveSources",
            actionIndex: 2
        });
        expect(indexedAction).toHaveBeenCalledWith("sources/retrieveSources", 2)
    });

    it('for loading source should use RETRIEVE_SOURCE_ACTION as actionType', () => {
        retrieveSourceLoadingSelector;
        expect(loadingSelector).toHaveBeenCalledWith("sources/retrieveSource");

    });

    it('for source error should use RETRIEVE_SOURCE_ACTION as actionType', () => {
        retrieveSourceErrorSelector;
        expect(errorSelector).toHaveBeenCalledWith("sources/retrieveSource");
    });

    it('for source should return source from the given state', () => {
        const testSources: SourceState = {
            sources: [
                {items: [testSource]}],
            source: testSource
        };
        const state = currentState(testSources);
        const source = sourceSelector(state);
        expect(source).toBe(testSource);
    });
    it('for loading source should use CREATE_SOURCE_ACTION as actionType',() => {
        createSourceLoadingSelector;
        expect(loadingSelector).toHaveBeenCalledWith("sources/create");
    });
    it('for error source should use CREATE_SOURCE_ACTION as actionType',() => {
        createSourceErrorSelector;
        expect(errorSelector).toHaveBeenCalledWith("sources/create");
    });
});
