import { combineReducers } from 'redux';
import AuthReducers from './authReducers';
import sources from './sourcesReducer';
import organizations from './dictionaryReducer';
import concepts from './ConceptReducers';
import dictionaries from './dictionaryReducers';
import generalSearch from './generalSearchReducer';
import user from './user';

// combined reducer to give a global state
const rootReducer = combineReducers({
  users: AuthReducers,
  sources,
  organizations,
  concepts,
  dictionaries,
  generalSearch,
  user,
});

export default rootReducer;
