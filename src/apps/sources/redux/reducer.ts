import {createReducer} from "@reduxjs/toolkit";
import {Action} from "../../../redux";
import {SourceState} from "../types";
import {CREATE_SOURCE_ACTION, RETRIEVE_SOURCE_ACTION, RETRIEVE_SOURCES_ACTION} from "./actionTypes";
import {LOGOUT_ACTION} from "../../authentication/redux/actionTypes";

const initialState: SourceState = {
    sources: []
};

export const reducer = createReducer(initialState, {
    [CREATE_SOURCE_ACTION]: (state, action) => ({
        ...state,
        newSource: action.payload
    }),
    [RETRIEVE_SOURCES_ACTION]: (
        state,
        {actionIndex, payload, responseMeta}: Action
    ) => {
        state.sources[actionIndex] = {items: payload, responseMeta};
    },
    [RETRIEVE_SOURCE_ACTION]: (state, action) => ({
        ...state,
        source: action.payload
    }),
    [LOGOUT_ACTION]: () =>{
        return initialState;
    },
});
export {reducer as default};
