import '@testing-library/jest-dom'
import {
    BrowserRouter as Router,
} from "react-router-dom";
import {render} from "@testing-library/react";
import {Provider} from "react-redux";
import store from "../../../../redux";
import {ViewConceptsPage} from "../../pages";
import {StateProps, ActionProps, OwnProps} from "../../pages/ViewConceptsPage"
import * as React from "react";
import {APIProfile} from "../../../authentication";
import { DICTIONARY_VERSION_CONTAINER} from "../../constants";

type viewConceptsPageProps = React.ComponentProps<typeof ViewConceptsPage>;

const apiProfile: APIProfile = {
    email: "email", organizations_url: "orgUrl", url: "url", username: "user1"
};

const stateProps: StateProps = {
    concepts: [],
    dictionary: undefined,
    loading: false,
    errors: {},
    meta: {num_found: 4},
    profile: apiProfile,
    usersOrgs: undefined
};

const actionProps: ActionProps = {
    retrieveConcepts: function () {
    },
    retrieveDictionary: function () {
    },
    addConceptsToDictionary: function () {
    },
    removeConceptsFromDictionary: function () {
    },
};

const ownProps: OwnProps = {
    containerType: DICTIONARY_VERSION_CONTAINER
};

// @ts-ignore
const baseProps: viewConceptsPageProps = stateProps & actionProps & ownProps;

function renderUI(props: Partial<viewConceptsPageProps> = {}) {
    return render(<Provider store={store}>
            <Router>
                <ViewConceptsPage {...baseProps} {...props}/>
            </Router>
        </Provider>
    );
}

describe('ViewConceptsPage', () => {
    let getByTestId: Function;
    beforeEach(() => {
         getByTestId = () => {renderUI(baseProps)};
    });

    it('should contain header', () => {
        expect(getByTestId("header")).not.toBeNull();
    });

    it('should contain conceptsTable', () => {
        expect(getByTestId("conceptsTableHeader")).not.toBeNull();
    });

    it('should contain filterOptions', () => {
        expect(getByTestId("filterOptions")).not.toBeNull();
    });
});


