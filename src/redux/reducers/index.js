import { combineReducers } from 'redux';
import AuthReducers from './authReducers';
import sources from './sourcesReducer';
import concepts from './ConceptReducers';


// combined reducer to give a global state
const rootReducer = combineReducers({
  users: AuthReducers,
  sources,
  concepts,
});

export default rootReducer;
