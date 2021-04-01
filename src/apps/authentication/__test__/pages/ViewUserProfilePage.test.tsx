import "@testing-library/jest-dom";
import * as React from "react";
import {
  initialState,
  testAPIOrgList,
  testProfile,
  testToken
} from "../test_data";
import { render } from "../../../../test-utils";
import {
  mapDispatchToProps,
  mapStateToProps,
  ViewUserProfilePage
} from "../../pages/ViewUserProfilePage";
import { getUserDetailsAction } from "../../redux";

type viewUserProfilePageProps = React.ComponentProps<
  typeof ViewUserProfilePage
>;

const baseProps: viewUserProfilePageProps = {
  userProfile: testProfile,
  userOrganisations: testAPIOrgList,
  userToken: testToken
};

function renderUI(props: Partial<viewUserProfilePageProps> = {}) {
  return render(<ViewUserProfilePage {...baseProps} {...props} />);
}

describe("viewUserProfilePage", () => {
  it("viewUserProfilePage snapshot test", () => {
    const { container } = renderUI();
    expect(container).toMatchSnapshot();
  });

  it("user profile of the state should not be null", () => {
    expect(mapStateToProps(initialState).userProfile).not.toBeNull();
  });

  it("user organisation of the state should not be null", () => {
    expect(mapStateToProps(initialState).userOrganisations).not.toBeNull();
  });

  it("user token of the state should not be null", () => {
    expect(mapStateToProps(initialState).userToken).not.toBeNull();
  });

  it("user profile of the state should match test profile", () => {
    expect(mapStateToProps(initialState).userProfile).toEqual(testProfile);
  });

  it("user organisation of the state should match test user organisation", () => {
    expect(mapStateToProps(initialState).userOrganisations).toEqual(
      testAPIOrgList
    );
  });

  it("user token of the state should match test user token", () => {
    expect(mapStateToProps(initialState).userToken).toEqual(testToken);
  });

  it("retrieveUserDetails should point to correct action", () => {
    expect(mapDispatchToProps.retrieveUserDetails).toBe(getUserDetailsAction);
  });
});
