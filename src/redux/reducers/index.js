import { combineReducers } from 'redux';
import AuthReducers from './authReducers';


// combined reducer to give a global state
const rootReducer = combineReducers({
  users: AuthReducers,
});

export default rootReducer;
