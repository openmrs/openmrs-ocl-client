import {APIOrg, APIProfile, AuthState} from "../types";
import {AppState, StatusState} from "../../../redux";
import {DictionaryState} from "../../dictionaries";
import {ConceptsState} from "../../concepts";
import {SourceState} from "../../sources";

export const testProfile: APIProfile = {
    username: "TestUser",
    name: "TestUser",
    email: "TestUser@test.com",
    company: "Test Company",
    location: "Test Location",
    created_on: "1900-01-01T00:00:00.000"
};

export const testToken = "TestToken";

export const testAPIOrgList: APIOrg[] = [
    {
        id: "test1",
        name: "Test Organisation",
        url: ""
    },
    {
        id: "test2",
        name: "Another Organisation",
        url: ""
    }
];

const authState: AuthState = {
    isLoggedIn: true,
    orgs: testAPIOrgList,
    profile: testProfile,
    token: testToken
};

const statusState: StatusState = {key: []};

const dictionariesState: DictionaryState = {
    dictionaries: [{items: []}],
    versions: [],
    addReferencesResults: []
};

const conceptState: ConceptsState = {
    concepts: {items: []},
    activeConcepts: {items: []},
    mappings: []
};

export const sourceState: SourceState = {
    sources: [{items: []}]
};

export const initialState: AppState = {
    auth: authState,
    status: statusState,
    dictionaries: dictionariesState,
    concepts: conceptState,
    sources: sourceState
};

