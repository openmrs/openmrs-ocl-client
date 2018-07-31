import { combineReducers } from 'redux';
import AuthReducers from './authReducers';
import sources from './sourcesReducer';
import organizations from './dictionaryReducer';
import concepts from './ConceptReducers';
import dictionaries from './dictionaryReducers';
import generalSearch from './generalSearchReducer';
import user from './user';
import cielConcepts from './bulkConcepts/index';

// combined reducer to give a global state
const rootReducer = combineReducers({
  users: AuthReducers,
  sources,
  organizations,
  concepts,
  dictionaries,
  generalSearch,
  user,
  cielConcepts,
});

export default rootReducer;
