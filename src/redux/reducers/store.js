import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reduxThunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from './index';

export const STORE_VERSION = '1';
export const CURRENT_STORE_VERSION_KEY = 'currentStoreVersion';

const saveState = (state) => {
  try {
    localStorage.setItem('state', JSON.stringify(state));
    localStorage.setItem(CURRENT_STORE_VERSION_KEY, STORE_VERSION);
    return undefined;
  } catch (e) {
    return undefined;
  }
};

export const loadState = () => {
  try {
    const state = localStorage.getItem('state');
    if (state === null) {
      return undefined;
    }

    const currentStoreVersion = localStorage.getItem(CURRENT_STORE_VERSION_KEY);
    if (currentStoreVersion !== STORE_VERSION) {
      return undefined;
    }

    return JSON.parse(state);
  } catch (e) {
    return undefined;
  }
};

const middlewares = [reduxThunk];
const persistedState = loadState();
if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger);
}

const store = createStore(
  rootReducer,
  persistedState,
  composeWithDevTools(applyMiddleware(...middlewares)),
);

store.subscribe(() => {
  saveState(store.getState());
});

export default store;
