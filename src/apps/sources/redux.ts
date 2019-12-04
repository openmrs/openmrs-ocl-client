import { createActionThunk, indexedAction, loadingSelector } from '../../redux'
import api from './api'
import { errorSelector } from '../../redux/redux'
import { SourceState } from './types'
import { AnyAction } from 'redux'

const CREATE_SOURCE_ACTION = 'sources/create'
const RETRIEVE_SOURCE_ACTION = 'sources/retrieve'
const EDIT_SOURCE_ACTION = 'sources/edit'

const createSourceAction = createActionThunk(CREATE_SOURCE_ACTION, api.create)
const retrieveSourceAction = createActionThunk(RETRIEVE_SOURCE_ACTION, api.retrieve)
const editSourceAction = createActionThunk(EDIT_SOURCE_ACTION, api.update)

const initialState: SourceState = {}

const reducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case RETRIEVE_SOURCE_ACTION:
      return { ...state, source: action.payload }
    default:
      return state
  }
}

const createSourceErrorSelector = errorSelector(indexedAction(CREATE_SOURCE_ACTION))
const retrieveSourceLoadingSelector = loadingSelector(indexedAction(RETRIEVE_SOURCE_ACTION))
const editSourceErrorSelector = errorSelector(indexedAction(EDIT_SOURCE_ACTION))

export {
  reducer as default,
  createSourceAction,
  createSourceErrorSelector,
  retrieveSourceAction,
  retrieveSourceLoadingSelector,
  editSourceAction,
  editSourceErrorSelector,
}
