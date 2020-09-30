import '@testing-library/jest-dom'
import {
    BrowserRouter as Router,
} from "react-router-dom";
import {APISource} from "../../types";
import {render} from "@testing-library/react";
import {Provider} from "react-redux";
import store from "../../../../redux";
import {ViewSourcePage} from "../../pages";
import {APIOrg, APIProfile} from "../../../authentication";
import * as React from "react";

type viewSourcePageProps = React.ComponentProps<typeof ViewSourcePage>;
const apiProfile: APIProfile = {
    email: "", organizations_url: "", url: "", username: ""
};
const apiOrg: APIOrg = {
    id: "", name: "", url: ""
};
const source: APISource = {
    active_concepts: 0,
    concepts_url: "",
    custom_validation_schema: "",
    default_locale: "",
    description: "",
    external_id: "",
    full_name: "test",
    id: "",
    name: "test",
    owner: "",
    owner_type: "",
    owner_url: "",
    public_access: "",
    short_code: "MSF01",
    source_type: "Dictionary",
    supported_locales: [],
    url: "url",
    website: ""
};
const baseProps: viewSourcePageProps = {
    profile: apiProfile,
    usersOrgs: [apiOrg],
    sourceLoading: false,
    source: source,
    retrieveSourceAndDetails: function retrieveSourceAndDetails() {
    },
    retrieveSourceErrors: {}
};

function renderUI(props: Partial<viewSourcePageProps> = {}) {
    return render(<Provider store={store}>
            <Router>
                <ViewSourcePage {...baseProps} {...props}  />
            </Router>
        </Provider>
    );
}

describe('ViewSourcePage', () => {
    it('viewSourcePage snapshot test', () => {
        const {container} = renderUI();
        expect(container).toMatchSnapshot();
    });
    xit('header components should have the source title and source name', () => {
        const {getByText} = renderUI();
        expect(getByText("Your Sources >")).toBeInTheDocument()
    });
});
