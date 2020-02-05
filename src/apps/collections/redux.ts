import {
  completeAction,
  createActionThunk,
  errorListSelector,
  FAILURE,
  indexedAction,
  loadingListSelector,
  progressAction,
  progressListSelector,
  startAction
} from "../../redux";
import api from "./api";
import { CollectionState } from "./types";
import { APIConcept } from "../concepts";
import { recursivelyFetchToConcepts } from "./logic";
import { createReducer } from "@reduxjs/toolkit";
import { CIEL_CONCEPTS_URL } from '../concepts/constants'

const RETRIEVE_COLLECTION_ACTION = "collections/retrieve";
const ADD_CONCEPTS_TO_COLLECTION = "collections/Add concept(s) to collection";
const REMOVE_REFERENCES_FROM_COLLECTION = "collections/Remove reference(s) from collection"

const addCIELConceptsToCollectionAction = (
  collectionUrl: string,
  rawConcepts: (APIConcept | string)[],
  bulk: boolean=false,
) => async (dispatch: Function, getState: Function) => {
  const concepts = rawConcepts.map(concept => typeof concept === 'string' ? {id: concept, url: `${CIEL_CONCEPTS_URL}${concept}/`, display_name: concept} : concept);
  const conceptOrConcepts =
    concepts.length > 1 ? `concepts (${concepts.length})` : "concept";
  const thisOrThese = concepts.length > 1 ? "these" : "this";
  const actionIndex =
    addConceptsToCollectionProgressListSelector(getState())?.length || 0;
  const updateProgress = (message: string) => {
    const headerMessage = concepts.map(concept => concept.display_name).join(", ");
    dispatch(
      progressAction(
        indexedAction(ADD_CONCEPTS_TO_COLLECTION, actionIndex),
        `Adding ${conceptOrConcepts}: ${headerMessage}--${message}`
      )
    )
  }

  dispatch(startAction(indexedAction(ADD_CONCEPTS_TO_COLLECTION, actionIndex)));

  const referencesToAdd = await recursivelyFetchToConcepts(
    concepts.map(concept => concept.id),
    updateProgress
  );
  updateProgress(
    referencesToAdd.length
      ? `Adding ${thisOrThese} and ${referencesToAdd.length} dependent concepts...`
      : `Adding ${conceptOrConcepts}...`
  );

  try {
    const response = await api.references.add(collectionUrl, [
      ...referencesToAdd,
      ...concepts.map(concept => concept.url)
    ]);
    dispatch({
      type: ADD_CONCEPTS_TO_COLLECTION,
      actionIndex: actionIndex,
      payload: response.data,
      meta: [collectionUrl, concepts, bulk],
    });
    updateProgress(`Added ${conceptOrConcepts}`);
  } catch (e) {
    dispatch({
      type: `${ADD_CONCEPTS_TO_COLLECTION}_${FAILURE}`,
      actionIndex: actionIndex,
      payload: e.response?.data,
      meta: [collectionUrl, concepts, bulk],
    });
  }

  dispatch(
    completeAction(indexedAction(ADD_CONCEPTS_TO_COLLECTION, actionIndex))
  );
};
const addConceptsToCollectionAction = createActionThunk(indexedAction(ADD_CONCEPTS_TO_COLLECTION, 100), api.references.add);
const removeReferencesFromCollectionAction = createActionThunk(REMOVE_REFERENCES_FROM_COLLECTION, api.references.delete);

const initialState: CollectionState = {
  addReferencesResults: []
};

const reducer = createReducer(initialState, {
  [RETRIEVE_COLLECTION_ACTION]: (state, action) => ({
    ...state,
    collection: action.payload
  }),
  [ADD_CONCEPTS_TO_COLLECTION]: (state, { actionIndex, payload, meta }) => {
    state.addReferencesResults[actionIndex] = { payload, meta };
  }
});

const addConceptsToCollectionLoadingListSelector = loadingListSelector(
  ADD_CONCEPTS_TO_COLLECTION
);
const addConceptsToCollectionProgressListSelector = progressListSelector(
  ADD_CONCEPTS_TO_COLLECTION
);
const addConceptsToCollectionErrorListSelector = errorListSelector(
  ADD_CONCEPTS_TO_COLLECTION
);

export {
  reducer as default,
  addCIELConceptsToCollectionAction,
  addConceptsToCollectionLoadingListSelector,
  addConceptsToCollectionProgressListSelector,
  addConceptsToCollectionErrorListSelector,
  removeReferencesFromCollectionAction,
  addConceptsToCollectionAction,
};
