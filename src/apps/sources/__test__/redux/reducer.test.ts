import {reducer} from "../../redux/reducer";
import {APISource, SourceState} from "../../types";
import {CREATE_SOURCE_ACTION, RETRIEVE_SOURCE_ACTION, RETRIEVE_SOURCES_ACTION} from "../../redux/actionTypes";

const testSource: APISource = {
    id: "MSF-SOURCE",
    short_code: "MSF-SRC",
    name: "MSF Source",
    full_name: "MSF Source",
    source_type: "Dictionary",
    public_access: "View",
    default_locale: "en",
    website: "http://msf.org/",
    description: "A universal code system for identifying laboratory and clinical observations.",
    extras: {"msf_extra_field": "msf_extra_value"},
    url: "/users/root/sources/MSF-SRC/",
    owner: "root",
    owner_type: "User",
    owner_url: "/users/root/",
    external_id: "123",
    supported_locales: ["en", "fr"],
    custom_validation_schema: "Dictionary",
    active_concepts: 2,
    concepts_url: "",
};

const initialState: SourceState = {
    sources: [{items: [], responseMeta: undefined}]
};

describe('sources reducer', () => {
  it('should return initial state when empty payload is passed', () => {
      const startAction = {
          type: RETRIEVE_SOURCES_ACTION,
          actionIndex: 0,
          payload: []
      };
      expect(reducer(initialState, startAction)).toEqual(initialState);
  });

  it('should return updated state with given payload', () => {
      const startAction = {
          type: RETRIEVE_SOURCES_ACTION,
          actionIndex: 0,
          payload: [testSource]
      };
      const expectedState = {
          sources: [
              {
                  items: [testSource],
                  responseMeta: undefined
              }
          ]
      };
      expect(reducer(initialState, startAction)).toEqual(expectedState);
  });

  it('should return updated state with given payload considering given actionIndex', () => {
      const startAction = {
          type: RETRIEVE_SOURCES_ACTION,
          actionIndex: 1,
          payload: [testSource]
      };
      const expectedState = {
          sources: [
              {
                  items: [],
                  responseMeta: undefined
              },
              {
                  items: [testSource],
                  responseMeta: undefined
              }
          ]
      };
      expect(reducer(initialState, startAction)).toEqual(expectedState);
  });

  it('should return updated state with given payload and responseMeta considering given actionIndex', () => {
      const startAction = {
          type: RETRIEVE_SOURCES_ACTION,
          actionIndex: 1,
          payload: [testSource],
          responseMeta: {key: false}
      };
      const expectedState = {
          sources: [
              {
                  items: [],
                  responseMeta: undefined
              },
              {
                  items: [testSource],
                  responseMeta: {key: false}
              }
          ]
      };
      expect(reducer(initialState, startAction)).toEqual(expectedState);
  });
});
describe("RETRIEVE_SOURCE_ACTION", () => {
    it('should return initial state when empty payload is passed', () => {
        const startAction = {
            type: RETRIEVE_SOURCE_ACTION,
            action: {
                payload: []
            }
        };
        expect(reducer(initialState, startAction)).toEqual(initialState);
    });

    it('should return updated state with given payload', () => {
        const startAction = {
                type: RETRIEVE_SOURCE_ACTION,
                payload: [testSource]
            }
        ;
        const expectedState = {
            sources: [
                {
                    items: [],
                    responseMeta: undefined
                }
            ],
            source: [
                testSource
            ]
        };
        expect(reducer(initialState, startAction)).toEqual(expectedState);
    });
});

describe("CREATE_SOURCE_ACTION", () => {
    it('should return updated state with given payload', () => {
        const startAction = {
            type: CREATE_SOURCE_ACTION,
            payload: [testSource]
        };
        const expectedState = {
            sources: [
                {
                    items: [],
                    responseMeta: undefined
                }
            ],
            newSource: [
                testSource
            ]
        };
        expect(reducer(initialState, startAction)).toEqual(expectedState);
    });

    it('should return initial state when empty payload is passed', () => {
        const startAction = {
            type: CREATE_SOURCE_ACTION,
            action: {
                payload: []
            }
        };
        expect(reducer(initialState, startAction)).toEqual(initialState);
    });
});
