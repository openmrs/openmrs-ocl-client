import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { APISource } from "../../types";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../../../redux";
import {
  mapDispatchToProps,
  mapStateToProps,
  ViewSourcePage
} from "../../pages/ViewSourcePage";
import { APIOrg, APIProfile } from "../../../authentication";
import * as React from "react";
import { currentState, personalSources } from "../test_data";
import {
  retrieveSourceAndDetailsAction,
  createSourceVersionAction,
  retrieveSourceVersionsAction,
  editSourceVersionAction
} from "../../redux";
import {
  retrieveActiveConceptsAction,
  retrieveConceptsAction
} from "../../../concepts/redux";

jest.mock(
  "../../../../components/Header",
  () => ({
    children,
    title
  }: {
    children?: React.ReactNode[];
    title: string;
  }) => (
    <div>
      <div>{title}</div>
      {children}
    </div>
  )
);

type viewSourcePageProps = React.ComponentProps<typeof ViewSourcePage>;
const apiProfile: APIProfile = {
  email: "",
  organizations_url: "",
  url: "",
  username: ""
};
const apiOrg: APIOrg = {
  id: "",
  name: "",
  url: ""
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
  retrieveSourceAndDetails: jest.fn(),
  retrieveConceptsSummary: jest.fn(),
  retrieveActiveConceptsSummary: jest.fn(),
  retrieveSourceErrors: false,
  createSourceVersion: jest.fn(),
  retrieveSourceVersions: jest.fn(),
  editSourceVersion: jest.fn(),
  versions: [],
  versionsLoading: false,
  createVersionLoading: true
};

function renderUI(props: Partial<viewSourcePageProps> = {}) {
  return render(
    <Provider store={store}>
      <Router>
        <ViewSourcePage {...baseProps} {...props} />
      </Router>
    </Provider>
  );
}
const state = currentState(personalSources);

describe("ViewSourcePage", () => {
  it("viewSourcePage snapshot test", () => {
    const { container } = renderUI();
    expect(container).toMatchSnapshot();
  });
  it("list of profiles of the state should not be null", () => {
    expect(mapStateToProps(state).profile).not.toBeNull();
  });
  it("total orgs of the state should not be null", () => {
    expect(mapStateToProps(state).usersOrgs).not.toBeNull();
  });
  it("source loading props of the state should not be null", () => {
    expect(mapStateToProps(state).sourceLoading).not.toBeNull();
  });
  it("the source of the state should not be null", () => {
    expect(mapStateToProps(state).source).not.toBeNull();
  });
  it("the metaConceptsCount of the state should not be null", () => {
    expect(mapStateToProps(state).metaConceptsCount).not.toBeNull();
  });
  it("the metaConceptsCount of the state should be 4", () => {
    expect(mapStateToProps(state).metaConceptsCount).toStrictEqual({
      num_found: 4
    });
  });
  it("the metaActiveConceptsCount of the state should not be null", () => {
    expect(mapStateToProps(state).metaActiveConceptsCount).not.toBeNull();
  });
  it("the metaActiveConceptsCount of the state should be 4", () => {
    expect(mapStateToProps(state).metaActiveConceptsCount).toStrictEqual({
      num_found: 3
    });
  });
  it("retrieveSource should point to correct dispatch action", () => {
    expect(mapDispatchToProps.retrieveSourceAndDetails).toBe(
      retrieveSourceAndDetailsAction
    );
  });
  it("retrieveConceptsSummary should point to correct dispatch action", () => {
    expect(mapDispatchToProps.retrieveConceptsSummary).toBe(
      retrieveConceptsAction
    );
  });
  it("retrieveActiveConceptsSummary should point to correct dispatch action", () => {
    expect(mapDispatchToProps.retrieveActiveConceptsSummary).toBe(
      retrieveActiveConceptsAction
    );
  });
  it("createSourceVersion should point to correct dispatch action", () => {
    expect(mapDispatchToProps.createSourceVersion).toBe(
      createSourceVersionAction
    );
  });
  it("retrieveSourceVersions should point to correct dispatch action", () => {
    expect(mapDispatchToProps.retrieveSourceVersions).toBe(
      retrieveSourceVersionsAction
    );
  });
  it("editSourceVersion should point to correct dispatch action", () => {
    expect(mapDispatchToProps.editSourceVersion).toBe(editSourceVersionAction);
  });
  it("versions from state should be empty array", () => {
    expect(mapStateToProps(state).versions).not.toBeNull();
  });
  it("versionLoading from state should be false", () => {
    expect(mapStateToProps(state).versionsLoading).toBe(false);
  });
  it("versions from state should be empty array", () => {
    expect(mapStateToProps(state).createVersionLoading).toBe(false);
  });
});
