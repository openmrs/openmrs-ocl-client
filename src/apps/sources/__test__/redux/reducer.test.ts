import {reducer} from "../../redux/reducer";
import {APISource, SourceState} from "../../types";
import {RETRIEVE_SOURCES_ACTION} from "../../redux/actionTypes";

describe('sources reducer', () => {

    const source1: APISource = {
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
            payload: [source1]
        };
        const expectedState = {
            sources: [
                {
                    items: [source1],
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
            payload: [source1]
        };
        const expectedState = {
            sources: [
                {
                    items: [],
                    responseMeta: undefined
                },
                {
                    items: [source1],
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
            payload: [source1],
            responseMeta: {key: false}
        };
        const expectedState = {
            sources: [
                {
                    items: [],
                    responseMeta: undefined
                },
                {
                    items: [source1],
                    responseMeta: {key: false}
                }
            ]
        };
        expect(reducer(initialState, startAction)).toEqual(expectedState);
    });
});