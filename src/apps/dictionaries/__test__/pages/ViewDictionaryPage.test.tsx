import '@testing-library/jest-dom'
import {
    BrowserRouter as Router,
} from "react-router-dom";
import {render} from "@testing-library/react";
import * as React from "react";
import {Provider} from "react-redux";
import store, {AppState, StatusState} from "../../../../redux";
import {mapDispatchToProps, mapStateToProps, ViewDictionaryPage} from "../../pages/ViewDictionaryPage";
import {APIDictionary, APIDictionaryVersion, DictionaryState} from "../../types";
import {APIOrg, APIProfile, AuthState} from "../../../authentication";
import {
    createDictionaryVersionAction,
    editDictionaryVersionAction,
    retrieveDictionaryAndDetailsAction, retrieveDictionaryVersionsAction
} from "../../redux";
import {ConceptsState} from "../../../concepts";
import {SourceState} from "../../../sources";

type viewDictionaryPageProps = React.ComponentProps<typeof ViewDictionaryPage>;


const testDictionary: APIDictionary = {
    custom_validation_schema: "Openmrs",
    default_locale: "en",
    description: "None",
    external_id: "2",
    // @ts-ignore
    extras: {source: undefined},
    full_name: "Test Dictionary",
    id: "2",
    name: "Test",
    preferred_source: "CIEL",
    public_access: "View",
    website: "Website",
    supported_locales: ["fr", "es"],
    short_code: "TD",
    owner: "you",
    owner_type: "user",
    owner_url: "",
    url: "url",
    active_concepts: "4",
    references: [{["reference1"]: "concept1"}],
    concepts_url: "collection/concepts"
};

const apiProfile: APIProfile = {
    email: "email", organizations_url: "orgUrl", url: "url", username: "you"
};

const apiOrg: APIOrg = {
    id: "", name: "", url: ""
};

const baseProps: viewDictionaryPageProps = {
    createDictionaryVersion(args: any): void {
    },
    createVersionError: {detail: ""},
    createVersionLoading: false,
    dictionary: testDictionary,
    dictionaryLoading: false,
    editDictionaryVersion(args: any): void {
    },
    profile: apiProfile,
    retrieveDictionaryAndDetails(args: any): void {
    },
    retrieveDictionaryErrors: undefined,
    retrieveDictionaryVersions(args: any): void {
    },
    usersOrgs: [apiOrg],
    versions: [],
    versionsLoading: false
};

const releasedVersion: APIDictionaryVersion = {
    id: "2",
    released: true,
    version_url: "version_url",
    url: "url",
    external_id: "3"
};

const authState: AuthState = { isLoggedIn: true };

const statusState: StatusState = { key: [] };

const dictionariesState: DictionaryState = {
    dictionaries: [{ items: [] }],
    versions: [releasedVersion],
    addReferencesResults: [],
    dictionary: testDictionary
};

const conceptState: ConceptsState = {
    concepts: { items: [] },
    mappings: [],
};

const sourceState: SourceState = {
    sources: [],
};

const currentState: AppState = {
    auth: authState,
    status: statusState,
    dictionaries: dictionariesState,
    concepts: conceptState,
    sources: sourceState,
};

function renderUI(props: Partial<viewDictionaryPageProps> = {}) {
    return render(<Provider store={store}>
            <Router>
                <ViewDictionaryPage {...baseProps} {...props}  />
            </Router>
        </Provider>
    );
}

describe('viewDictionaryPage snapshot', () => {
    it('viewDictionaryPage snapshot test', () => {
        const {container} = renderUI();
        expect(container).toMatchSnapshot();
    });
});

describe('viewDictionaryPage', () => {
    it('should list down all the props of the state', () => {
        expect(mapStateToProps(currentState).dictionaryLoading).not.toBeNull();
        expect(mapStateToProps(currentState).versionsLoading).not.toBeNull();
        expect(mapStateToProps(currentState).createVersionLoading).not.toBeNull();
        expect(mapStateToProps(currentState).profile).not.toBeNull();
        expect(mapStateToProps(currentState).usersOrgs).not.toBeNull();
        expect(mapStateToProps(currentState).dictionary).not.toBeNull();
        expect(mapStateToProps(currentState).versions).not.toBeNull();
        expect(mapStateToProps(currentState).createVersionError).not.toBeNull();
        expect(mapStateToProps(currentState).retrieveDictionaryErrors).not.toBeNull();
    });

    it('should update the loading status with current state', () => {
        expect(mapStateToProps(currentState).dictionaryLoading).toEqual(false);
        expect(mapStateToProps(currentState).versionsLoading).toEqual(false);
        expect(mapStateToProps(currentState).createVersionLoading).toEqual(false);
    });

    it('should assign existing dictionary to the dictionary prop', () => {
        expect(mapStateToProps(currentState).dictionary).toEqual(testDictionary);
    });

    it('should assign existing dictionary versions to the versions prop', () => {
        expect(mapStateToProps(currentState).versions).toEqual([releasedVersion]);
    });

    it('should point to correct dispatch action', () => {
        expect(mapDispatchToProps.retrieveDictionaryAndDetails).toBe(retrieveDictionaryAndDetailsAction);
        expect(mapDispatchToProps.createDictionaryVersion).toBe(createDictionaryVersionAction);
        expect(mapDispatchToProps.editDictionaryVersion).toBe(editDictionaryVersionAction);
        expect(mapDispatchToProps.retrieveDictionaryVersions).toBe(retrieveDictionaryVersionsAction);
    })
});
