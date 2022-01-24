import React from "react";
import { render } from "../../../../test-utils.test";
import "@testing-library/jest-dom";
import ConceptsTable from "../../components/ConceptsTable";
import {
  ConceptName,
  ConceptDescription,
  APIConcept,
  APIMapping
} from "../../types";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../App";
type conceptsTableProps = React.ComponentProps<typeof ConceptsTable>;
const baseProps: conceptsTableProps = {
  concepts: [],
  buttons: {},
  q: "",
  setQ: function() {},
  page: 1,
  sortDirection: "sortAsc",
  sortBy: "id",
  limit: 10,
  buildUrl: function() {},
  goTo: function() {},
  count: 5,
  toggleShowOptions: function() {},
  addConceptsToDictionary: function() {},
  linkedDictionary: "",
  linkedSource: "",
  canModifyConcept: () => {
    return true;
  },
  removeConceptsFromDictionary: function() {}
};

const testConceptName: ConceptName = {
  name: "test concept",
  locale: "en",
  external_id: "1234",
  locale_preferred: true,
  name_type: "Fully Specified"
};

const testDescription: ConceptDescription = {
  description: "concept description",
  locale: "en",
  external_id: "3456",
  locale_preferred: true
};

const testMapping: APIMapping = {
  map_type: "test",
  external_id: "79787",
  from_concept_url: "from_concept_url",
  url: "concept_url",
  retired: false,
  to_concept_code: "concept_code"
};
const testConcept: APIConcept = {
  id: "123",
  external_id: "234234",
  concept_class: "Diagnosis",
  datatype: "Numeric",
  names: [testConceptName],
  descriptions: [testDescription],
  url: "abcd",
  version_url: "version_url",
  extras: {},
  display_name: "display_name",
  mappings: [testMapping],
  retired: false,
  source_url: "source_url",
  source: "My source"
};

function renderUI(props: Partial<conceptsTableProps> = {}) {
  return render(
    <ThemeProvider theme={theme}>
      <ConceptsTable {...baseProps} {...props} />{" "}
    </ThemeProvider>
  );
}

describe("Action Icon for the Concepts in Concepts Table", () => {
  it("should show the action icon if the user has the edit access", () => {
    const { container } = renderUI({
      buttons: { edit: true },
      canModifyConcept: () => {
        return true;
      },
      linkedSource: "abc",
      concepts: [testConcept]
    });
    const actionIcon = container.querySelector("[data-testid='action-icon']");

    expect(actionIcon).not.toBeNull();
  });

  it("should not show the action icon if the user does not have the edit access", () => {
    const { container } = renderUI({
      canModifyConcept: () => {
        return false;
      }
    });
    const actionIcon = container.querySelector("[data-testid='action-icon']");

    expect(actionIcon).toBeNull();
  });

  it("should not show the action icon if the user has the edit access but edit button is false", () => {
    const { container } = renderUI({
      buttons: { edit: false },
      canModifyConcept: () => {
        return true;
      },
      linkedSource: "abc",
      concepts: [testConcept]
    });
    const actionIcon = container.querySelector("[data-testid='action-icon']");

    expect(actionIcon).toBeNull();
  });

  it("should not show the action icon if the user has the edit access but linked source is undefined", () => {
    const { container } = renderUI({
      buttons: { edit: true },
      canModifyConcept: () => {
        return true;
      },
      linkedSource: undefined,
      concepts: [testConcept]
    });
    const actionIcon = container.querySelector("[data-testid='action-icon']");

    expect(actionIcon).toBeNull();
  });

  it("should not show the action icon if the user has the edit access but concept url does not contain the linked source", () => {
    const { container } = renderUI({
      buttons: { edit: false },
      canModifyConcept: () => {
        return true;
      },
      linkedSource: "xyz",
      concepts: [testConcept]
    });
    const actionIcon = container.querySelector("[data-testid='action-icon']");

    expect(actionIcon).toBeNull();
  });
});
