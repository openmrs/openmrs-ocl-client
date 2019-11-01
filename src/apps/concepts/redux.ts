import { createActionThunk, loadingSelector, startAction } from '../../redux'
import api from './api'
import { ConceptsState } from './types'
import { AnyAction } from 'redux'
import { errorSelector } from '../../redux/redux'

const CREATE_CONCEPT_ACTION = 'concepts/createConcept';

const createConceptAction = createActionThunk(CREATE_CONCEPT_ACTION, api.create);

const initialState: ConceptsState = {

}

const reducer = (state=initialState, action: AnyAction) => {
  switch (action.type) {
    case startAction(CREATE_CONCEPT_ACTION).type:
      return {...state, newConcept: undefined};
    case CREATE_CONCEPT_ACTION:
      return {...state, newConcept: action.payload};
    default:
      return state;
  }
}

const createConceptLoadingSelector = loadingSelector(CREATE_CONCEPT_ACTION);
const createConceptErrorsSelector = errorSelector(CREATE_CONCEPT_ACTION);

export {
  reducer as default,
  createConceptAction,
  createConceptLoadingSelector,
  createConceptErrorsSelector,
};
