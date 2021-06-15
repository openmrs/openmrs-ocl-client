import React from "react";
import { render } from "../../../../test-utils.test";
import "@testing-library/jest-dom";
import AddConceptsIcon from "../../components/AddConceptsIcon";
import { CONCEPT_CLASSES } from "../../../../utils";

type addConceptsIconProps = React.ComponentProps<typeof AddConceptsIcon>;

const baseProps: addConceptsIconProps = {
  canModifyDictionary: false,
  canModifySource: false,
  containerUrl: "",
  gimmeAUrl: function(arg1: string, arg2: string) {
    return arg2;
  },
  linkedSource: "linkedSource",
  preferredSource: "Public Sources"
};

function renderUI(props: Partial<addConceptsIconProps> = {}) {
  return render(<AddConceptsIcon {...baseProps} {...props} />);
}
describe("AddConceptsIcon Snapshot test", () => {
  it("Snapshot", () => {
    const render = renderUI();
    expect(render).toMatchSnapshot();
  });
});

describe("AddConceptsIcon", () => {
  let queryByTestId: Function;
  let importExistingConceptMenu: HTMLElement | null;
  let createCustomConceptMenu: HTMLElement | null;

  beforeAll(() => {
    const queries = renderUI();
    queryByTestId = queries.queryByTestId;
    importExistingConceptMenu = queryByTestId("importExistingConceptMenu");
    createCustomConceptMenu = queryByTestId("createCustomConceptMenu");
  });

  it("Import existing concept menu should be present", () => {
    expect(importExistingConceptMenu).not.toBeNull();
  });

  it("Import existing concept menu should contain Pick concepts", () => {
    expect(importExistingConceptMenu).toHaveTextContent("Pick concepts");
  });

  it("Import existing concept menu should contain Add bulk concepts", () => {
    expect(importExistingConceptMenu).toHaveTextContent("Add bulk concepts");
  });

  it("Create custom concept menu should be present", () => {
    expect(createCustomConceptMenu).not.toBeNull();
  });

  it("create custom concept menu should contain first 9 concept names", () => {
    CONCEPT_CLASSES.slice(0, 9).forEach(function(key) {
      expect(createCustomConceptMenu).toHaveTextContent(key + " Concept");
    });
  });

  it("create custom concept menu should contain other kind", () => {
    expect(createCustomConceptMenu).toHaveTextContent("Other kind");
  });
});

describe("Check the visibility of add icon", () => {
  it("add icon should be present to add concepts in dictionary", () => {
    const { queryByTestId } = renderUI({
      canModifyDictionary: true
    });
    const addConcepts: HTMLElement | null = queryByTestId("addConceptsIcon");

    expect(addConcepts).not.toBeNull();
  });

  it("add icon should be present to add custom concepts in source", () => {
    const { queryByTestId } = renderUI({
      canModifySource: true
    });
    const addCustomConcepts: HTMLElement | null = queryByTestId(
      "addCustomConceptIcon"
    );

    expect(addCustomConcepts).not.toBeNull();
  });

  it("add icon should not be present if user does not have permissions to modify dictionary", () => {
    const { queryByTestId } = renderUI({
      canModifyDictionary: false
    });
    const addConcepts: HTMLElement | null = queryByTestId("addConceptsIcon");

    expect(addConcepts).toBeNull();
  });

  it("add icon should not be present if user does not have permissions to modify source", () => {
    const { queryByTestId } = renderUI({
      canModifySource: false
    });
    const addCustomConcepts: HTMLElement | null = queryByTestId(
      "addCustomConceptIcon"
    );

    expect(addCustomConcepts).toBeNull();
  });
});
