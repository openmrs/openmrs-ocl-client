import {
  completeAction,
  createActionThunk,
  errorListSelector,
  FAILURE,
  indexedAction,
  loadingListSelector,
  loadingSelector,
  progressAction,
  progressListSelector,
  startAction
} from "../../redux";
import api from "./api";
import { errorSelector } from "../../redux/redux";
import { CollectionState } from "./types";
import { APIConcept } from "../concepts";
import { recursivelyFetchToConcepts } from "./logic";
import { createReducer } from "@reduxjs/toolkit";
import { CIEL_CONCEPTS_URL } from '../concepts/constants'

const CREATE_COLLECTION_ACTION = "collections/create";
const RETRIEVE_COLLECTION_ACTION = "collections/retrieve";
const EDIT_COLLECTION_ACTION = "collections/edit";
const ADD_CONCEPTS_TO_COLLECTION = "collections/Add concept(s) to collection";

const createCollectionAction = createActionThunk(
  CREATE_COLLECTION_ACTION,
  api.create
);
const retrieveCollectionAction = createActionThunk(
  RETRIEVE_COLLECTION_ACTION,
  api.retrieve
);
const editCollectionAction = createActionThunk(
  EDIT_COLLECTION_ACTION,
  api.update
);
const addCIELConceptsToCollectionAction = (
  collectionUrl: string,
  rawConcepts: (APIConcept | string)[],
  bulk: boolean=false,
) => async (dispatch: Function, getState: Function) => {
  const concepts = rawConcepts.map(concept => typeof concept === 'string' ? {id: concept, url: `${CIEL_CONCEPTS_URL}${concept}/`, display_name: ''} : concept);
  const conceptOrConcepts =
    concepts.length > 1 ? `concepts (${concepts.length})` : "concept";
  const thisOrThese = concepts.length > 1 ? "these" : "this";
  const actionIndex =
    addConceptsToCollectionProgressListSelector(getState())?.length || 0;
  const updateProgress = (message: string) => {
    const headerMessage = bulk ? 'bulk' : concepts
      .map(concept => concept.display_name)
      .join(", ");
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

const createCollectionErrorSelector = errorSelector(
  indexedAction(CREATE_COLLECTION_ACTION)
);
const retrieveCollectionLoadingSelector = loadingSelector(
  indexedAction(RETRIEVE_COLLECTION_ACTION)
);
const editCollectionErrorSelector = errorSelector(
  indexedAction(EDIT_COLLECTION_ACTION)
);

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
  createCollectionAction,
  createCollectionErrorSelector,
  retrieveCollectionAction,
  retrieveCollectionLoadingSelector,
  editCollectionAction,
  editCollectionErrorSelector,
  addCIELConceptsToCollectionAction,
  addConceptsToCollectionLoadingListSelector,
  addConceptsToCollectionProgressListSelector,
  addConceptsToCollectionErrorListSelector
};
