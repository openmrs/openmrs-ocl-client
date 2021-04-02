import { reducer } from "../../redux/reducer";
import { APIConcept, ConceptsState } from "../../types";
import { RETRIEVE_ACTIVE_CONCEPTS_ACTION } from "../../redux/actionTypes";

const testConcept: APIConcept = {
  display_name: "testConcept",
  url: "url",
  version_url: "versionUrl",
  mappings: [],
  retired: false,
  source_url: "sourceUrl",
  id: "testId",
  external_id: "extId",
  concept_class: "",
  datatype: "TEXT",
  names: [],
  descriptions: [],
  extras: {}
};

const initialState: ConceptsState = {
  mappings: [],
  concepts: {
    items: [],
    responseMeta: undefined
  },
  activeConcepts: {
    items: [],
    responseMeta: undefined
  }
};

describe("RETRIEVE_ACTIVE_CONCEPTS_ACTION", () => {
  it("should return initial state when empty payload is passed", () => {
    const startAction = {
      type: RETRIEVE_ACTIVE_CONCEPTS_ACTION,
      action: {
        payload: [],
        responseMeta: undefined
      }
    };
    expect(reducer(initialState, startAction)).toEqual(initialState);
  });

  it("should return updated state with given payload", () => {
    const startAction = {
      type: RETRIEVE_ACTIVE_CONCEPTS_ACTION,
      payload: [testConcept],
      responseMeta: { num_found: 1 }
    };
    const expectedState = {
      mappings: [],
      concepts: {
        items: [],
        responseMeta: undefined
      },
      activeConcepts: {
        items: [testConcept],
        responseMeta: { num_found: 1 }
      }
    };
    expect(reducer(initialState, startAction)).toEqual(expectedState);
  });
});
