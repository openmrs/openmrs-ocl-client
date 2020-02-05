import { createReducer } from '@reduxjs/toolkit'
import { indexedAction, startAction } from '../../../redux'
import { Action } from '../../../redux/utils'
import { DictionaryState } from '../types'
import {
  ADD_CONCEPTS_TO_COLLECTION,
  CREATE_DICTIONARY_ACTION,
  CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION,
  EDIT_DICTIONARY_ACTION,
  EDIT_SOURCE_COLLECTION_DICTIONARY_ACTION,
  RETRIEVE_COLLECTION_ACTION,
  RETRIEVE_DICTIONARIES_ACTION,
  RETRIEVE_DICTIONARY_ACTION,
  RETRIEVE_DICTIONARY_VERSIONS_ACTION
} from './actionTypes'

const initialState: DictionaryState = {
  dictionaries: [],
  versions: [],
  addReferencesResults: [],
}
export const reducer = createReducer(initialState, {
  [startAction(indexedAction(CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION))
    .type]: state => ({
    ...state,
    newDictionary: undefined
  }),
  [CREATE_DICTIONARY_ACTION]: (state, action) => ({
    ...state,
    newDictionary: action.payload
  }),
  [RETRIEVE_DICTIONARY_ACTION]: (state, action) => ({
    ...state,
    dictionary: action.payload
  }),
  [RETRIEVE_DICTIONARIES_ACTION]: (
    state,
    { actionIndex, payload, responseMeta }: Action
  ) => {
    state.dictionaries[actionIndex] = { items: payload, responseMeta }
  },
  [startAction(indexedAction(EDIT_SOURCE_COLLECTION_DICTIONARY_ACTION))
    .type]: state => ({
    ...state,
    editedDictionary: undefined
  }),
  [EDIT_DICTIONARY_ACTION]: (state, action) => ({
    ...state,
    editedDictionary: action.payload
  }),
  [RETRIEVE_DICTIONARY_VERSIONS_ACTION]: (state, action) => ({
    ...state,
    versions: action.payload
  }),
  [RETRIEVE_COLLECTION_ACTION]: (state, action) => ({
    ...state,
    collection: action.payload
  }),
  [ADD_CONCEPTS_TO_COLLECTION]: (state, { actionIndex, payload, meta }) => {
    state.addReferencesResults[actionIndex] = { payload, meta };
  }
})
export { reducer as default }
