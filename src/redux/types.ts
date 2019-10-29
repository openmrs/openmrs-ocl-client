import {AuthState} from "../apps/authentication";
import {DictionaryState} from "../apps/dictionaries";
import {SourceState} from "../apps/sources";
import {CollectionState} from "../apps/collections";

export interface AppState {
    auth: AuthState,
    status: { [key: string]: boolean | string | undefined },
    dictionaries: DictionaryState,
    sources: SourceState,
    collections: CollectionState,
}
