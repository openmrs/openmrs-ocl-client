import { AuthState } from "../apps/authentication";
import { DictionaryState } from "../apps/dictionaries";
import { SourceState } from "../apps/sources";
import { ConceptsState } from "../apps/concepts";

interface StatusState {
  [key: string]: boolean[] | string[] | undefined[];
}

export interface AppState {
  auth: AuthState;
  status: StatusState;
  dictionaries: DictionaryState;
  sources: SourceState;
  concepts: ConceptsState;
}
