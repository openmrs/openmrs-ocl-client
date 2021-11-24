import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../../../redux";
import { ViewConceptsPage } from "../../pages";
import {
  StateProps,
  ActionProps,
  OwnProps
} from "../../pages/ViewConceptsPage";
import * as React from "react";
import { APIProfile } from "../../../authentication";
import { DICTIONARY_VERSION_CONTAINER } from "../../constants";
import { theme } from "../../../../App";
import { ThemeProvider } from "@mui/material/styles";

type viewConceptsPageProps = React.ComponentProps<typeof ViewConceptsPage>;

const apiProfile: APIProfile = {
  email: "email",
  organizations_url: "orgUrl",
  url: "url",
  username: "user1"
};

const stateProps: StateProps = {
  concepts: [],
  dictionary: undefined,
  loading: false,
  errors: {},
  meta: { num_found: 4 },
  profile: apiProfile,
  usersOrgs: undefined
};

const actionProps: ActionProps = {
  retrieveConcepts: function() {},
  retrieveDictionary: function() {},
  addConceptsToDictionary: function() {},
  removeConceptsFromDictionary: function() {},
  retrieveSource: function() {}
};

const ownProps: OwnProps = {
  containerType: DICTIONARY_VERSION_CONTAINER
};

// @ts-ignore
const baseProps: viewConceptsPageProps = stateProps & actionProps & ownProps;

function renderUI(props: Partial<viewConceptsPageProps> = {}) {
  return render(
    <Provider store={store}>
      <Router>
        <ThemeProvider theme={theme}>
          <ViewConceptsPage {...baseProps} {...props} />
        </ThemeProvider>
      </Router>
    </Provider>
  );
}

describe("ViewConceptsPage", () => {
  let queryByTestId: Function;
  beforeEach(() => {
    const queries = renderUI(baseProps);
    queryByTestId = queries.queryByTestId;
  });

  it("should contain header", () => {
    expect(queryByTestId("header")).not.toBeNull();
  });

  it("should contain conceptsTable", () => {
    expect(queryByTestId("conceptsTableHeader")).not.toBeNull();
  });

  it("should contain filterOptions", () => {
    expect(queryByTestId("filterOptions")).not.toBeNull();
  });
});
