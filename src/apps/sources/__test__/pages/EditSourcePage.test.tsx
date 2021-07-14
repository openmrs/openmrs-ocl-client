import * as React from "react";
import EditSourcePage, {
  ActionProps,
  mapActionsToProps,
  mapStateToProps,
  StateProps
} from "../../pages/EditSourcePage";
import { APIOrg, APIProfile } from "../../../authentication";
import { currentState, personalSources, testSource } from "../test_data";
import { render } from "../../../../test-utils.test";
import {
  editSourceDispatchAction,
  retrieveSourceAndDetailsAction
} from "../../redux";

type EditSourcePageProps = React.ComponentProps<typeof EditSourcePage>;

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

const stateProps: StateProps = {
  errors: {},
  profile: apiProfile,
  usersOrgs: [apiOrg],
  loading: false,
  source: testSource,
  editedSource: testSource
};

const actionProps: ActionProps = {
  editSourceAction: function editSourceAction() {},
  retrieveSourceAction: function retrieveSourceAction() {}
};

const baseProps: EditSourcePageProps = { ...stateProps, ...actionProps };

const state = currentState(personalSources);

function renderUI(props: Partial<EditSourcePageProps> = {}) {
  return render(<EditSourcePage {...baseProps} {...props} />);
}

describe("EditSourcePage", () => {
  it("editSourcePage snapshot test", () => {
    const { container } = renderUI();
    expect(container).toMatchSnapshot();
  });
  it("should list down loading props of the state", () => {
    expect(mapStateToProps(state).loading).not.toBeNull();
  });
  it("should list down profile props of the state", () => {
    expect(mapStateToProps(state).profile).not.toBeNull();
  });
  it("should list down errors props of the state", () => {
    expect(mapStateToProps(state).errors).not.toBeNull();
  });
  it("should list down userOrgs props of the state", () => {
    expect(mapStateToProps(state).usersOrgs).not.toBeNull();
  });
  it("should update the loading status with current state", () => {
    expect(mapStateToProps(state).loading).toEqual(false);
  });
  it("should update newSource value with current state", () => {
    expect(mapStateToProps(state).editedSource).not.toBeNull();
  });
  it("should update source value with current state", () => {
    expect(mapStateToProps(state).source).not.toBeNull();
  });
  it("should point to correct dispatch action", () => {
    expect(mapActionsToProps.editSourceAction).toBe(editSourceDispatchAction);
  });
  it("should point to correct retrieve action", () => {
    expect(mapActionsToProps.retrieveSourceAction).toBe(
      retrieveSourceAndDetailsAction
    );
  });
});
