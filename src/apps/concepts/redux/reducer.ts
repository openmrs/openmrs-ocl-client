import { createReducer } from "@reduxjs/toolkit";
import { APIConcept, ConceptsState } from "../types";
import { indexedAction, startAction } from "../../../redux";
import {
  RETRIEVE_CONCEPT_ACTION,
  RETRIEVE_CONCEPTS_ACTION,
  UPSERT_CONCEPT_ACTION,
  UPSERT_MAPPING_ACTION
} from "./actionTypes";

const initialState: ConceptsState = {
  mappings: []
};
export const reducer = createReducer<ConceptsState>(initialState, {
  [startAction(indexedAction(UPSERT_CONCEPT_ACTION)).type]: state => ({
    ...state,
    concept: undefined
  }),
  [startAction(indexedAction(RETRIEVE_CONCEPT_ACTION)).type]: state => ({
    ...state,
    concept: undefined
  }),
  [UPSERT_CONCEPT_ACTION]: (state, action) => ({
    ...state,
    concept: action.payload
  }),
  [RETRIEVE_CONCEPT_ACTION]: (state, { payload }) => ({
    ...state,
    concept: payload,
    mappings: payload.mappings || []
  }),
  [RETRIEVE_CONCEPTS_ACTION]: (state, action) => ({
    ...state,
    concepts: {
      items: action.payload as APIConcept[],
      responseMeta: action.responseMeta
    }
  }),
  [UPSERT_MAPPING_ACTION]: (state, { actionIndex, payload, meta }) => {
    const mappingIndex = state.mappings.findIndex(
      mapping => mapping.external_id === payload.external_id
    );
    if (mappingIndex !== -1) state.mappings[mappingIndex] = payload;
    else state.mappings.push(payload);
  }
});
export { reducer as default };
