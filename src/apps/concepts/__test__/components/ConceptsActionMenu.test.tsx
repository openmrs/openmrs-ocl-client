import React from "react";
import { render } from "../../../../test-utils";
import "@testing-library/jest-dom";
import ConceptsActionMenu from "../../components/ConceptsActionMenu";
import {
  APIConcept,
  ConceptName,
  ConceptDescription,
  APIMapping,
} from "../../types";

type conceptsActionMenuProps = React.ComponentProps<typeof ConceptsActionMenu>;

const testConceptName: ConceptName = {
  name: "test concept",
  locale: "en",
  external_id: "1234",
  locale_preferred: true,
  name_type: "Fully Specified",
};

const testDescription: ConceptDescription = {
  description: "concept description",
  locale: "en",
  external_id: "3456",
  locale_preferred: true,
};

const testMapping: APIMapping = {
  map_type: "test",
  external_id: "79787",
  from_concept_url: "from_concept_url",
  url: "concept_url",
  retired: false,
  to_concept_code: "concept_code",
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
};
const baseProps: conceptsActionMenuProps = {
  index: 1,
  row: testConcept,
  buttons: { edit: true },
  toggleMenu: function() {},
  menu: { index: 1, anchor: document.createElement("div") },
  canModifyConcept: () => {
    return true;
  },
  removeConceptsFromDictionary: function() {},
  addConceptsToDictionary: function() {},
  linkedSource: "",
  linkedDictionary: "",
};

function renderUI(props: Partial<conceptsActionMenuProps> = {}) {
  return render(<ConceptsActionMenu {...baseProps} {...props} />);
}

describe("ConceptsActionMenu", () => {
  it("should match snapshot", () => {
    const { container } = renderUI();

    expect(container).toMatchSnapshot();
  });
});
