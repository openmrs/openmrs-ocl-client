import React from "react";
import { render } from "../../../../test-utils";
import { UserOrganisationDetails } from "../../components";
import { testAPIOrgList } from "../test_data";

type userOrganisationDetailsProps = React.ComponentProps<
  typeof UserOrganisationDetails
>;

const baseProps: userOrganisationDetailsProps = {
  orgs: testAPIOrgList
};

function renderUI(props: Partial<userOrganisationDetailsProps> = {}) {
  return render(<UserOrganisationDetails {...baseProps} {...props} />);
}

describe("UserOrganisationDetails", () => {
  it("should match snapshot", () => {
    const { container } = renderUI(baseProps);

    expect(container).toMatchSnapshot();
  });
});

describe("View User Organisations", () => {
  it("should not show no user organisations message when user is part of at least one organisation", () => {
    const { queryByTestId } = renderUI(baseProps);

    expect(queryByTestId("noUserOrgsMessage")).toBeNull();
  });

  it("should show no user organisations message when user is not part of at least one organisation", () => {
    const { queryByTestId } = renderUI({
      orgs: []
    });
    const noUserOrgsMessage = queryByTestId("noUserOrgsMessage") || {
      textContent: null
    };

    expect(noUserOrgsMessage.textContent).toBe(
      "You're not part of any Organisation"
    );
  });
});
