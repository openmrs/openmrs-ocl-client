import {applyMiddleware, combineReducers, createStore} from "redux";
import reduxThunk from "redux-thunk";
import {composeWithDevTools} from "redux-devtools-extension";
import {loadingAndErroredReducer} from "./redux";
import {authReducer} from "./apps/authentication";

export const STORE_VERSION = '1';
export const CURRENT_STORE_VERSION_KEY = 'currentStoreVersion';

const saveState = (appState: any) => {
    const doNotPersist = [
        'status',
    ].reduce((previousValue, item) => ({...previousValue, [item]: undefined}), {});
    const state = {
        ...appState,
        ...doNotPersist,
    };

    try {
        localStorage.setItem('state', JSON.stringify(state));
        localStorage.setItem(CURRENT_STORE_VERSION_KEY, STORE_VERSION);
        return undefined;
    } catch (e) {
        return undefined;
    }
};

export const loadState = () => {
    try {
        const state = localStorage.getItem('state');
        if (state === null) {
            return undefined;
        }

        const currentStoreVersion = localStorage.getItem(CURRENT_STORE_VERSION_KEY);
        if (currentStoreVersion !== STORE_VERSION) {
            return undefined;
        }

        return JSON.parse(state);
    } catch (e) {
        return undefined;
    }
};

const rootReducer = combineReducers({
    'auth': authReducer,
    'status': loadingAndErroredReducer,
});

const store = createStore(
    rootReducer,
    loadState(),
    composeWithDevTools(applyMiddleware(reduxThunk)),
);

store.subscribe(() => {
    saveState(store.getState());
});

export default store;
