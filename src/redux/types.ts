import { AuthState } from "../apps/authentication";
import { DictionaryState } from "../apps/dictionaries";
import { ConceptsState } from "../apps/concepts";
import { AnyAction } from "redux";
import {SourceState} from "../apps/sources";

interface StatusState {
  [key: string]: boolean[] | string[] | undefined[];
}

export interface AppState {
  auth: AuthState;
  status: StatusState;
  dictionaries: DictionaryState;
  concepts: ConceptsState;
  sources: SourceState;
}

export interface LoadingAndErroredState {
  [key: string]: (boolean | {} | undefined)[];
}

export interface Action extends AnyAction {
  type: string;
  payload?: any;
  actionIndex: number;
  meta: any[];
  responseMeta?: {};
}

export interface IndexedAction {
  actionType: string;
  actionIndex: number;
}
