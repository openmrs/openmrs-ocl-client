import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reduxThunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from './index';

const saveState = (state) => {
  try {
    localStorage.setItem('state', JSON.stringify(state));
    return undefined;
  } catch (e) {
    return undefined;
  }
};

const loadState = () => {
  try {
    const state = localStorage.getItem('state');
    if (state === null) {
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
  saveState({
    users: { loggedIn: store.getState().users.loggedIn },
  });
});

export default store;
