import React from "react";
import { Organisation } from "../../types";
import { render, fireEvent, act } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { CONTEXT } from "../../../../utils";
import OrganisationForm from "../../components/OrgForm";

type orgFormProps = React.ComponentProps<typeof OrganisationForm>;

let onSubmit = jest.fn();

const testOrg: Organisation = {
  id: "T1",
  name: "Test organisation",
  company: "Test company",
  website: "https://test.com",
  location: "Belgium",
  public_access: "View",
  extras: null
};
const baseProps: orgFormProps = {
  onSubmit: onSubmit,
  loading: true,
  status: "",
  errors: [],
  context: CONTEXT.view,
  savedValues: testOrg
};

function renderUI(props: Partial<orgFormProps> = {}) {
  return render(
    <Router>
      <OrganisationForm {...baseProps} {...props} />
    </Router>
  );
}

describe("View OrgForm ", () => {
  it("snapshot test", () => {
    const { container } = renderUI();
    expect(container).toMatchSnapshot();
  });
  it("should populate mandatory field values", () => {
    const { getByLabelText } = renderUI();
    // @ts-ignore
    expect(getByLabelText("Organisation ID").value).toBe("T1");
    // @ts-ignore
    expect(getByLabelText("Organisation Name").value).toBe("Test organisation");
  });
  it("should populate non mandatory field values", () => {
    const { getByLabelText } = renderUI();
    // @ts-ignore
    expect(getByLabelText("Company").value).toBe("Test company");
  });
});

describe("Create OrgForm", () => {
  it("should be able to enter values for Organization ID ", async () => {
    const { getByLabelText, getByText } = renderUI({
      context: CONTEXT.create
    });
    let orgID: HTMLInputElement = getByLabelText(
      /Organisation ID/
    ) as HTMLInputElement;
    let submitButton: HTMLInputElement = getByText(
      "Submit"
    ) as HTMLInputElement;
    await act(async () => {
      fireEvent.change(orgID, { target: { value: "T1" } });
      fireEvent.click(submitButton);
    });
    expect(orgID.value).toBe("T1");
  });

  it("should be able to enter values for Organisation Name ", async () => {
    const { getByLabelText, getByText } = renderUI({
      context: CONTEXT.create
    });
    let orgName: HTMLInputElement = getByLabelText(
      /Organisation Name/
    ) as HTMLInputElement;
    let submitButton: HTMLInputElement = getByText(
      "Submit"
    ) as HTMLInputElement;
    await act(async () => {
      fireEvent.change(orgName, { target: { value: "Test organisation" } });
      fireEvent.click(submitButton);
    });
    expect(orgName.value).toBe("Test organisation");
  });

  it("should be able to enter values for Company ", async () => {
    const { getByLabelText, getByText } = renderUI({
      context: CONTEXT.create
    });
    let company: HTMLInputElement = getByLabelText(
      /Company/
    ) as HTMLInputElement;
    let submitButton: HTMLInputElement = getByText(
      "Submit"
    ) as HTMLInputElement;
    await act(async () => {
      fireEvent.change(company, { target: { value: "Test company" } });
      fireEvent.click(submitButton);
    });
    expect(company.value).toBe("Test company");
  });
});
