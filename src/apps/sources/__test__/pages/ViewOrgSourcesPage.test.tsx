import React from 'react';
import {mapDispatchToProps, mapStateToProps} from "../../pages/ViewOrgSourcesPage";
import {AppState, StatusState} from "../../../../redux";
import {APISource, SourceState} from "../../types";
import {AuthState} from "../../../authentication";
import {DictionaryState} from "../../../dictionaries";
import {ConceptsState} from "../../../concepts";
import {retrieveOrgSourcesAction} from "../../redux";

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
    concepts_url: ""
};

const initialSources: SourceState = {
    sources: [
        {items: []},
        {items: [testSource], responseMeta: {key: false}}]
};

const authState: AuthState = {isLoggedIn: true};

const statusState: StatusState = {'key': []};

const dictionariesState: DictionaryState = {
    dictionaries: [{items: []}],
    versions: [],
    addReferencesResults: []
};

const conceptState: ConceptsState = {
    concepts: {items: []},
    mappings: []
};

const currentState: AppState = {
    auth: authState,
    status: statusState,
    dictionaries: dictionariesState,
    concepts: conceptState,
    sources: initialSources
};


describe('ViewOrgSourcesPage', function () {

    it('should list down all the props of the state', () => {
        expect(mapStateToProps(currentState).loading).not.toBeNull();
        expect(mapStateToProps(currentState).sources).not.toBeNull();
        expect(mapStateToProps(currentState).meta).not.toBeNull();
    });

    it('should update the loading status with current state', () => {
        expect(mapStateToProps(currentState).loading).toEqual(false);
    });

    it('should assign existing sources to the sources prop', () => {
        expect(mapStateToProps(currentState).sources).toEqual([testSource]);
    });

    it('should update the response meta data from the current state', () => {
        expect(mapStateToProps(currentState).meta).toEqual({key: false});
    });

    it('should point to correct dispatch action', () => {
        expect(mapDispatchToProps.retrieveSources).toBe(retrieveOrgSourcesAction);
    })
});