import {
  completeAction,
  createActionThunk,
  indexedAction,
  loadingSelector,
  progressAction, resetAction,
  startAction
} from '../../redux'
import api from './api'
import { APIConcept, Concept, ConceptsState, Mapping } from './types'
import { errorSelector } from '../../redux/redux'
import { Action } from '../../redux/utils'

const CREATE_CONCEPT_ACTION = 'concepts/createConcept';
const RETRIEVE_CONCEPT_ACTION = 'concepts/retrieveConcept';
const CREATE_MAPPING_ACTION = 'concepts/createMapping';
const CREATE_CONCEPT_AND_MAPPINGS = 'concepts/createConceptAndMappings';
const RETRIEVE_CONCEPTS_ACTION = 'concepts/retrieveConcepts';

const createConceptAction = createActionThunk(indexedAction(CREATE_CONCEPT_ACTION), api.concepts.create);
const retrieveConceptAction = createActionThunk(RETRIEVE_CONCEPT_ACTION, api.concept.retrieve);
const createConceptAndMappingsAction = (sourceUrl: string, data: Concept) => {
  return async (dispatch: Function) => {
    dispatch(startAction(indexedAction(CREATE_CONCEPT_AND_MAPPINGS)));

    const {answers, sets, mappings, ...concept} = data;

    let conceptResponse: APIConcept | boolean;

    dispatch(progressAction(indexedAction(CREATE_CONCEPT_AND_MAPPINGS), 'Creating concept...'));
    conceptResponse = await dispatch(createConceptAction<APIConcept>(sourceUrl, concept));

    if (typeof conceptResponse === 'boolean') {
      // we have no url to work with, so there's no point going forward, todo could improve
      dispatch(completeAction(indexedAction(CREATE_CONCEPT_AND_MAPPINGS)));
      return false;
    }

    const newConcept: APIConcept = conceptResponse;
    await dispatch(resetAction(CREATE_MAPPING_ACTION));

    const createMappings = async (rawMappings: Mapping[], batchIndex: number) => {
      const mappings = rawMappings.map(mapping => {
        const {to_source_url, to_concept_code, to_concept_url, ...theRest} = mapping;
        return to_concept_code ?
          {
            ...theRest,
            from_concept_url: newConcept.url,
            to_source_url,
            to_concept_code,
          } :
          {
            ...theRest,
            from_concept_url: newConcept.url,
            to_concept_url,
          };
      });

      const actions: [Mapping, CallableFunction][] = mappings.map((mapping, index) => [mapping, createActionThunk(indexedAction(CREATE_MAPPING_ACTION, Number(`${batchIndex}${index}`)), api.mappings.create)]);
      await Promise.all(actions.map(([mapping, action]) => dispatch(action(sourceUrl, mapping))));
    };

    // I know you're thinking, oh, we could have done these in parallel
    // I see your in-parallel and raise you my race-condition
    // If a user duplicates a mapping say in answers and sets, we want to be able to sequentially point this out
    // todo some more robust error handling
    await createMappings(answers, 1);
    await createMappings(sets, 2);
    await createMappings(mappings, 3);

    dispatch(completeAction(indexedAction(CREATE_CONCEPT_AND_MAPPINGS)));
  }
};
const retrieveConceptsAction = createActionThunk(RETRIEVE_CONCEPTS_ACTION, api.concepts.retrieve);

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
    case RETRIEVE_CONCEPTS_ACTION:
      return {...state, concepts: {items: (action.payload as APIConcept[]), responseMeta: action.responseMeta}};
    default:
      return state;
  }
}

const createConceptLoadingSelector = loadingSelector(indexedAction(CREATE_CONCEPT_ACTION));
const createConceptErrorsSelector = errorSelector(indexedAction(CREATE_CONCEPT_ACTION));
const viewConceptLoadingSelector = loadingSelector(indexedAction(RETRIEVE_CONCEPT_ACTION));
const viewConceptErrorsSelector = errorSelector(indexedAction(RETRIEVE_CONCEPT_ACTION));
const viewConceptsLoadingSelector = loadingSelector(indexedAction(RETRIEVE_CONCEPTS_ACTION));
const viewConceptsErrorsSelector = errorSelector(indexedAction(RETRIEVE_CONCEPTS_ACTION));

export {
  reducer as default,
  createConceptAndMappingsAction,
  retrieveConceptAction,
  createConceptLoadingSelector,
  createConceptErrorsSelector,
  viewConceptLoadingSelector,
  viewConceptErrorsSelector,
  retrieveConceptsAction,
  viewConceptsLoadingSelector,
  viewConceptsErrorsSelector,
};
