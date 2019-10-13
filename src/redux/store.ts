import {applyMiddleware, combineReducers, createStore} from "redux";
import {authReducer} from "../authentication";
import thunk from "redux-thunk";
import {composeWithDevTools} from "redux-devtools-extension";
import {loadingAndErroredReducer} from "./redux";

const rootReducer = combineReducers({
    'auth': authReducer,
    'status': loadingAndErroredReducer,
});

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;
