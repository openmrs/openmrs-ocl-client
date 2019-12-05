import { cloneDeep } from 'lodash'

import { Action, IndexedAction } from './utils'
import { AppState } from './types'

interface LoadingAndErroredState {
  [key: string]: (boolean | {} | undefined)[],
}

const loading = (actionType: string): string => `${actionType}Loading`
const progress = (actionType: string): string => `${actionType}Progress`
const errors = (actionType: string): string => `${actionType}Errors`

// todo improve these action types args
const loadingAndErroredReducer = (state: LoadingAndErroredState = {}, action: Action) => {
  const { type, payload, actionIndex } = action
  const matches = /(.*)_(START|PROGRESS|FAILURE|COMPLETE|RESET)/.exec(type)

  if (!matches) return state

  const [, actionName, requestState] = matches
  const loadingName = loading(actionName)
  const progressName = progress(actionName)
  const errorName = errors(actionName)

  const newState = cloneDeep(state)

  switch (requestState) {
    case 'RESET': {
      newState[loadingName] = []
      newState[progressName] = []
      newState[errorName] = []

      return newState
    }
    case 'START': {
      if (!newState[loadingName]) newState[loadingName] = []
      if (!newState[progressName]) newState[progressName] = []
      if (!newState[errorName]) newState[errorName] = []

      newState[loadingName][actionIndex] = true
      newState[progressName][actionIndex] = undefined
      newState[errorName][actionIndex] = undefined

      return newState
    }
    case 'COMPLETE': {
      newState[loadingName][actionIndex] = false
      return newState
    }
    case 'PROGRESS': {
      newState[progressName][actionIndex] = payload
      return newState
    }
    case 'FAILURE': {
      newState[errorName][actionIndex] = payload
      return newState
    }
    default:
      return state
  }
}
const loadingSelector = (...actions: IndexedAction[]) => (state: AppState): boolean => actions.reduce((previousValue: boolean, { actionType, actionIndex }: IndexedAction): boolean => previousValue || Boolean(state.status[loading(actionType)] ? state.status[loading(actionType)][actionIndex] : false), false)
const progressSelector = ({ actionType, actionIndex }: IndexedAction) => (state: AppState): any => state.status[progress(actionType)] ? state.status[progress(actionType)][actionIndex] : undefined
const errorSelector = ({ actionType, actionIndex }: IndexedAction) => (state: AppState): any => state.status[errors(actionType)] ? state.status[errors(actionType)][actionIndex] : undefined
const progressListSelector = (actionType: string) => (state: AppState): any => state.status[progress(actionType)] ? state.status[progress(actionType)] : undefined
const errorListSelector = (actionType: string) => (state: AppState): any => state.status[errors(actionType)] ? state.status[errors(actionType)] : undefined

export {
  loadingSelector,
  progressSelector,
  errorSelector,
  progressListSelector,
  errorListSelector,
  loadingAndErroredReducer
}
