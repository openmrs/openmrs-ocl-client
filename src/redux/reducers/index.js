import { combineReducers } from 'redux';
import AuthReducers from './authReducers';
import organizations from './dictionaryReducer';
import concepts from './ConceptReducers';
import dictionaries from './dictionaryReducers';
import generalSearch from './generalSearchReducer';
import user from './user';
import sourceConcepts from './bulkConcepts/index';
import bulkConcepts from './bulkConceptReducer';

// combined reducer to give a global state
const rootReducer = combineReducers({
  users: AuthReducers,
  organizations,
  concepts,
  dictionaries,
  generalSearch,
  user,
  sourceConcepts,
  bulkConcepts,
});

export default rootReducer;
