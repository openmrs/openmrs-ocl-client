import {createActionThunk, loadingSelector} from "../../redux";
import api from "./api";
import {errorSelector} from "../../redux/redux";
import {SourceState} from "./types";
import {AnyAction} from "redux";

const CREATE_SOURCE_ACTION = 'sources/create';
const RETRIEVE_SOURCE_ACTION = 'sources/retrieve';

const createSourceAction = createActionThunk(CREATE_SOURCE_ACTION, api.create);
const retrieveSourceAction = createActionThunk(RETRIEVE_SOURCE_ACTION, api.retrieve);

const initialState: SourceState = {};

const reducer = (state = initialState, action: AnyAction) => {
    switch (action.type) {
        case RETRIEVE_SOURCE_ACTION:
            return {...state, source: action.payload};
        default:
            return state;
    }
};

const createSourceErrorSelector = errorSelector(CREATE_SOURCE_ACTION);
const retrieveSourceLoadingSelector = loadingSelector(RETRIEVE_SOURCE_ACTION);

export {
    reducer as default,
    createSourceAction,
    createSourceErrorSelector,
    retrieveSourceAction,
    retrieveSourceLoadingSelector
};
