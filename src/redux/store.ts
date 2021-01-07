import { applyMiddleware, combineReducers, createStore, Store } from "redux";
import reduxThunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import loadingAndErroredReducer from "./reducer";
import authReducer from "../apps/authentication/redux/reducer"; // failed to respect module here because of a circular import issue
import { dictionariesReducer } from "../apps/dictionaries";
import { conceptsReducer } from "../apps/concepts";
import { sourcesReducer } from "../apps/sources";
import { organisationsReducer } from "../apps/organisations";
import { AppState } from "./types";

export const STORE_VERSION = "1";
export const CURRENT_STORE_VERSION_KEY = "currentStoreVersion";

const doNotPersist = ["dictionaries", "concepts", "status", "sources"].reduce(
  (previousValue, item) => ({ ...previousValue, [item]: undefined }),
  {}
);

const saveState = (appState: AppState) => {
  const state = {
    ...appState,
    ...doNotPersist
  };

  try {
    localStorage.setItem("state", JSON.stringify(state));
    localStorage.setItem(CURRENT_STORE_VERSION_KEY, STORE_VERSION);
    return undefined;
  } catch (e) {
    return undefined;
  }
};

export const loadState = () => {
  try {
    const state = localStorage.getItem("state");
    if (state === null) {
      return undefined;
    }

    const currentStoreVersion = localStorage.getItem(CURRENT_STORE_VERSION_KEY);
    if (currentStoreVersion !== STORE_VERSION) {
      return undefined;
    }

    return { ...JSON.parse(state), ...doNotPersist };
  } catch (e) {
    return undefined;
  }
};

const rootReducer = combineReducers({
  auth: authReducer,
  status: loadingAndErroredReducer,
  dictionaries: dictionariesReducer,
  concepts: conceptsReducer,
  sources: sourcesReducer,
  organisations: organisationsReducer
});

const store = createStore(
  rootReducer,
  loadState(),
  process.env.NODE_ENV === "production" ?
    applyMiddleware(reduxThunk) :
    composeWithDevTools(applyMiddleware(reduxThunk))
);

store.subscribe(() => {
  saveState(store.getState());
});

export default store;


// required for Cypress tests
declare global {
  interface Window {
    store: Store
  }
}

if ('__Cypress__' in window) {
  window.store = store;
}
