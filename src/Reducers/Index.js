import { combineReducers, createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import AuthReducers from './AuthReducers';

// combined reducer to give a global state
const rootReducer = combineReducers({
  users: AuthReducers,
});
const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);

const store = createStoreWithMiddleware(rootReducer);

export default store;
