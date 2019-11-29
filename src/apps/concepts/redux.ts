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

const UPSERT_CONCEPT_ACTION = 'concepts/upsertConcept'
const RETRIEVE_CONCEPT_ACTION = 'concepts/retrieveConcept'
const UPSERT_MAPPING_ACTION = 'concepts/upsertMapping'
const UPSERT_CONCEPT_AND_MAPPINGS = 'concepts/createConceptAndMappings'
const RETRIEVE_CONCEPTS_ACTION = 'concepts/retrieveConcepts'

const retrieveConceptAction = createActionThunk(RETRIEVE_CONCEPT_ACTION, api.concept.retrieve)
const upsertConceptAndMappingsAction = (data: Concept, sourceUrl: string) => {
  return async (dispatch: Function) => {
    dispatch(startAction(indexedAction(UPSERT_CONCEPT_AND_MAPPINGS)))

    const { answers, sets, mappings, ...concept } = data

    let response: APIConcept | boolean

    dispatch(progressAction(indexedAction(UPSERT_CONCEPT_AND_MAPPINGS), 'Upserting concept...'))
    const [action, url] = concept.url ?
      [createActionThunk(UPSERT_CONCEPT_ACTION, api.concept.update), concept.url] :
      [createActionThunk(UPSERT_CONCEPT_ACTION, api.concepts.create), sourceUrl];
    response = await dispatch(action<APIConcept>(url, concept));

    if (typeof response === 'boolean') {
      // I think that at this point, it is generally sane not to try dealing with the mappings if the concept can't be updated. todo could improve.
      dispatch(completeAction(indexedAction(UPSERT_CONCEPT_AND_MAPPINGS)))
      return false
    }

    const conceptResponse: APIConcept = response

    await dispatch(resetAction(UPSERT_MAPPING_ACTION))

    const upsertMappings = async (rawMappings: Mapping[], batchIndex: number) => {
      const mappings = rawMappings.map(mapping => {
        const { to_source_url, to_concept_code, to_concept_url, ...theRest } = mapping
        return to_concept_code ?
          {
            ...theRest,
            from_concept_url: conceptResponse.url,
            to_source_url,
            to_concept_code,
          } :
          {
            ...theRest,
            from_concept_url: conceptResponse.url,
            to_concept_url,
          }
      });

      const actions: [Mapping, CallableFunction, string][] = mappings.map((mapping, index) => [
        mapping,
        createActionThunk(indexedAction(UPSERT_MAPPING_ACTION, Number(`${batchIndex}${index}`)), mapping.url ? api.mapping.update : api.mappings.create),
        mapping.url ? mapping.url : sourceUrl,
      ]);
      await Promise.all(actions.map(([mapping, action, url]) => dispatch(action(url, mapping))))
    }

    // I know you're thinking, oh, we could have done these in parallel
    // I see your in-parallel and raise you my race-condition
    // If a user duplicates a mapping say in answers and sets, we want to be able to sequentially point this out
    // todo some more robust error handling
    await upsertMappings(answers, 1)
    await upsertMappings(sets, 2)
    await upsertMappings(mappings, 3)

    dispatch(completeAction(indexedAction(UPSERT_CONCEPT_AND_MAPPINGS)))
  }
}
const retrieveConceptsAction = createActionThunk(RETRIEVE_CONCEPTS_ACTION, api.concepts.retrieve)

const initialState: ConceptsState = {}

const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case startAction(indexedAction(UPSERT_CONCEPT_ACTION)).type:
      return { ...state, upsertedConcept: undefined }
    case UPSERT_CONCEPT_ACTION:
      return { ...state, upsertedConcept: action.payload }
    case RETRIEVE_CONCEPT_ACTION:
      return { ...state, concept: action.payload }
    case RETRIEVE_CONCEPTS_ACTION:
      return { ...state, concepts: { items: (action.payload as APIConcept[]), responseMeta: action.responseMeta } }
    default:
      return state
  }
}

const upsertConceptAndMappingsLoadingSelector = loadingSelector(indexedAction(UPSERT_CONCEPT_AND_MAPPINGS))
const createConceptErrorsSelector = errorSelector(indexedAction(UPSERT_CONCEPT_ACTION))
const viewConceptLoadingSelector = loadingSelector(indexedAction(RETRIEVE_CONCEPT_ACTION))
const viewConceptErrorsSelector = errorSelector(indexedAction(RETRIEVE_CONCEPT_ACTION))
const viewConceptsLoadingSelector = loadingSelector(indexedAction(RETRIEVE_CONCEPTS_ACTION))
const viewConceptsErrorsSelector = errorSelector(indexedAction(RETRIEVE_CONCEPTS_ACTION))

export {
  reducer as default,
  upsertConceptAndMappingsAction,
  retrieveConceptAction,
  upsertConceptAndMappingsLoadingSelector,
  createConceptErrorsSelector,
  viewConceptLoadingSelector,
  viewConceptErrorsSelector,
  retrieveConceptsAction,
  viewConceptsLoadingSelector,
  viewConceptsErrorsSelector,
}
