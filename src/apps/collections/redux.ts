import { createActionThunk, indexedAction, loadingSelector } from '../../redux'
import api from "./api";
import {errorSelector} from "../../redux/redux";
import {AnyAction} from "redux";
import {CollectionState} from "./types";

const CREATE_COLLECTION_ACTION = 'collections/create';
const RETRIEVE_COLLECTION_ACTION = 'collections/retrieve';

const createCollectionAction = createActionThunk(indexedAction(CREATE_COLLECTION_ACTION), api.create);
const retrieveCollectionAction = createActionThunk(indexedAction(RETRIEVE_COLLECTION_ACTION), api.retrieve);

const initialState: CollectionState = {};

const reducer = (state = initialState, action: AnyAction) => {
    switch (action.type) {
        case RETRIEVE_COLLECTION_ACTION:
            return {...state, collection: action.payload};
        default:
            return state;
    }
};

const createCollectionErrorSelector = errorSelector(indexedAction(CREATE_COLLECTION_ACTION));
const retrieveCollectionLoadingSelector = loadingSelector(indexedAction(RETRIEVE_COLLECTION_ACTION));

export {
    reducer as default,
    createCollectionAction,
    createCollectionErrorSelector,
    retrieveCollectionAction,
    retrieveCollectionLoadingSelector
};
