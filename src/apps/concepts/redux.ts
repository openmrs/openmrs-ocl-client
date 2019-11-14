import { createActionThunk, indexedAction, loadingSelector, startAction } from '../../redux'
import api from './api'
import { ConceptsState } from './types'
import { errorSelector } from '../../redux/redux'
import { Action } from '../../redux/utils'

const CREATE_CONCEPT_ACTION = 'concepts/createConcept';

const createConceptAction = createActionThunk(indexedAction(CREATE_CONCEPT_ACTION), api.create);

const initialState: ConceptsState = {

}

const reducer = (state=initialState, action: Action) => {
  switch (action.type) {
    case startAction(indexedAction(CREATE_CONCEPT_ACTION)).type:
      return {...state, newConcept: undefined};
    case CREATE_CONCEPT_ACTION:
      return {...state, newConcept: action.payload};
    default:
      return state;
  }
}

const createConceptLoadingSelector = loadingSelector(indexedAction(CREATE_CONCEPT_ACTION));
const createConceptErrorsSelector = errorSelector(indexedAction(CREATE_CONCEPT_ACTION));

export {
  reducer as default,
  createConceptAction,
  createConceptLoadingSelector,
  createConceptErrorsSelector,
};
