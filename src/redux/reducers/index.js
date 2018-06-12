import { combineReducers } from 'redux';
import AuthReducers from './authReducers';
import sources from './sourcesReducer';
import organizations from './dictionaryReducer';


// combined reducer to give a global state
const rootReducer = combineReducers({
  users: AuthReducers,
  sources,
  organizations,
});

export default rootReducer;
