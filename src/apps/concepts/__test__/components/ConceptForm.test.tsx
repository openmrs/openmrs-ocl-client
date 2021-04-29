import React from "react";
import {v4 as uuid} from "uuid";
import { render } from "../../../../test-utils";
import { ConceptForm } from "../../components";
import { Concept } from "../../types";

type conceptFormProps = React.ComponentProps<typeof ConceptForm>;

const initialValues: Concept = {
  concept_class: "",
  datatype: "Coded",
  descriptions: [],
  external_id: uuid(),
  id: "",
  answers: [],
  sets: [],
  mappings: [],
  names: [],
  retired: false,
  extras: {}
};

const baseProps: conceptFormProps = {
  onSubmit: () => {},
  loading: true,
  status: "",
  errors: {},
  savedValues: initialValues,
  context: "view",
  allMappingErrors: [],
  conceptClass: "Diagnosis",
  supportLegacyMappings: true,
  defaultLocale: "",
  supportedLocales: []
};

function renderUI(props: Partial<conceptFormProps> = {}) {
  return render(<ConceptForm {...baseProps} {...props} />);
}

describe("ConceptForm ", () => {
  let queryByTestId: Function;
  beforeEach(() => {
    const queries = renderUI(baseProps);
    queryByTestId = queries.queryByTestId;
  });

  it("should show set members sections", () => {
    expect(queryByTestId("set-members")).not.toBeNull();
  });

  it("should show answers sections if datatype is coded", () => {
    expect(queryByTestId("answers")).not.toBeNull();
  });
});
