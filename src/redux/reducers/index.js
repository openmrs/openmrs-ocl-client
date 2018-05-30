import { combineReducers } from 'redux';
import AuthReducers from './authReducers';
import sources from './sourcesReducer';


// combined reducer to give a global state
const rootReducer = combineReducers({
  users: AuthReducers,
  sources,
});

export default rootReducer;
