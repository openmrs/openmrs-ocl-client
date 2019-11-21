import {
  completeAction,
  createActionThunk,
  indexedAction,
  loadingSelector,
  progressAction,
  startAction
} from '../../redux'
import api from './api'
import { APIConcept, Concept, ConceptsState } from './types'
import { errorSelector } from '../../redux/redux'
import { Action } from '../../redux/utils'

const CREATE_CONCEPT_ACTION = 'concepts/createConcept';
const RETRIEVE_CONCEPT_ACTION = 'concepts/retrieveConcept';
const CREATE_CONCEPT_AND_MAPPINGS = 'concepts/createConceptAndMappings';

const createConceptAction = createActionThunk(indexedAction(CREATE_CONCEPT_ACTION), api.create);
const retrieveConceptAction = createActionThunk(RETRIEVE_CONCEPT_ACTION, api.retrieve);
const createConceptAndMappingsAction = (sourceUrl: string, data: Concept) => {
  return async (dispatch: Function) => {
    dispatch(startAction(indexedAction(CREATE_CONCEPT_AND_MAPPINGS)));

    const {answers, sets, mappings, ...concept} = data;

    let conceptResponse: APIConcept | boolean;

    dispatch(progressAction(indexedAction(CREATE_CONCEPT_AND_MAPPINGS), 'Creating concept...'));
    conceptResponse = await dispatch(createConceptAction<APIConcept>(sourceUrl, concept));

    if (!conceptResponse) {
      dispatch(completeAction(indexedAction(CREATE_CONCEPT_AND_MAPPINGS)));
      return false;
    }

    dispatch(completeAction(indexedAction(CREATE_CONCEPT_AND_MAPPINGS)));
  }
};

const initialState: ConceptsState = {

}

const reducer = (state=initialState, action: Action) => {
  switch (action.type) {
    case startAction(indexedAction(CREATE_CONCEPT_ACTION)).type:
      return {...state, newConcept: undefined};
    case CREATE_CONCEPT_ACTION:
      return {...state, newConcept: action.payload};
    case RETRIEVE_CONCEPT_ACTION:
      return {...state, concept: action.payload};
    default:
      return state;
  }
}

const createConceptLoadingSelector = loadingSelector(indexedAction(CREATE_CONCEPT_ACTION));
const createConceptErrorsSelector = errorSelector(indexedAction(CREATE_CONCEPT_ACTION));
const viewConceptLoadingSelector = loadingSelector(indexedAction(RETRIEVE_CONCEPT_ACTION));
const viewConceptErrorsSelector = errorSelector(indexedAction(RETRIEVE_CONCEPT_ACTION));

export {
  reducer as default,
  createConceptAndMappingsAction,
  retrieveConceptAction,
  createConceptLoadingSelector,
  createConceptErrorsSelector,
  viewConceptLoadingSelector,
  viewConceptErrorsSelector,
};
