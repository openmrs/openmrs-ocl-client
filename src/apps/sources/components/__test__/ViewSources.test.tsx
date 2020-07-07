///<reference path="../../../../../node_modules/@types/testing-library__dom/queries.d.ts"/>
import React from 'react';
import ViewSources from '../../../../apps/sources/components/ViewSources';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom'
import {
    BrowserRouter as Router,
} from "react-router-dom";
import {APISource} from "../../types";
import {fireEvent} from "@testing-library/dom";

type viewSourcesProps = React.ComponentProps<typeof ViewSources>;

const msfSource :APISource = {
    id: "MSF-SOURCE",
    short_code: "MSF-SRC",
    name: "MSF Source",
    full_name: "MSF Source",
    source_type: "Dictionary",
    public_access: "View",
    default_locale: "en",
    website: "http://msf.org/",
    description: "A universal code system for identifying laboratory and clinical observations.",
    extras: { "msf_extra_field": "msf_extra_value" },
    url:"/users/root/sources/MSF-SRC/",
    owner:"root",
    owner_type:"User",
    owner_url:"/users/root/",
    external_id:"123",
    supported_locales: ["en", "fr"],
    custom_validation_schema: "Dictionary",
    active_concepts: 2,
    concepts_url: ""
};

const ceilSource :APISource = {
    id: "CEIL-SOURCE",
    short_code: "CEIL-SRC",
    name: "CEIL Source",
    full_name: "CEIL Source",
    source_type: "Dictionary",
    public_access: "View",
    default_locale: "en",
    website: "http://ceil.org/",
    description: "A universal code system for identifying laboratory and clinical observations.",
    extras: { "msf_extra_field": "msf_extra_value" },
    url:"/users/root/sources/CEIL-SRC/",
    owner:"root",
    owner_type:"User",
    owner_url:"/users/root/",
    external_id:"123",
    supported_locales: ["en", "fr"],
    custom_validation_schema: "Dictionary",
    active_concepts: 3,
    concepts_url: ""
};

const baseProps: viewSourcesProps = {
    sources: [],
    numFound: 10,
    onPageChange: function onPageChange() {
    },
    onSearch: function onSearch() {
    },
    page: 1,
    initialQ: "",
    title: ""
};

function renderUI(props: Partial<viewSourcesProps> = {}) {
    return render(
        <Router>
            <ViewSources {...baseProps} {...props} />
        </Router>
    );
}
describe('ViewSources', () => {
    it('should display shortCodes and names and owners of the respective sources that are present', () => {
        const {container} = renderUI({
            sources: [msfSource, ceilSource]
        });
        const sources: HTMLElement | null = container.querySelector("[data-testid='sources']");
        const msfSourceCard: HTMLElement | null = container.querySelector("[data-testid='MSF-SRC']");
        const ceilSourceCard: HTMLElement | null = container.querySelector("[data-testid='CEIL-SRC']");
        const msfSourceShortCode = container.querySelector( "[data-testid='sourceShortCode - MSF-SRC']");
        const ceilSourceShortCode: HTMLElement | null = container.querySelector("[data-testid='sourceShortCode - CEIL-SRC']");
        const msfSourceName: HTMLElement | null = container.querySelector("[data-testid='sourceName - MSF-SRC']");
        const ceilSourceName: HTMLElement | null = container.querySelector("[data-testid='sourceName - CEIL-SRC']");
        const msfSourceOwnerTypeAndOwner: HTMLElement | null = container.querySelector("[data-testid='sourceOwnerTypeAndOwner - MSF-SRC']");
        const ceilSourceOwnerTypeAndOwner: HTMLElement | null = container.querySelector("[data-testid='sourceOwnerTypeAndOwner - CEIL-SRC']");

        expect(msfSourceCard).not.toBeNull();
        expect(ceilSourceCard).not.toBeNull();
        expect(msfSourceShortCode).toHaveTextContent("MSF-SRC");
        expect(ceilSourceShortCode).toHaveTextContent("CEIL-SRC");
        expect(msfSourceName).toHaveTextContent("MSF Source");
        expect(ceilSourceName).toHaveTextContent("CEIL Source");
        expect(msfSourceOwnerTypeAndOwner).toHaveTextContent("User/root");
        expect(ceilSourceOwnerTypeAndOwner).toHaveTextContent("User/root");
        expect(sources).not.toHaveTextContent("No Sources Found");

    });

    it('should display "No Sources Found" when no sources are present', () => {
        const {container} = renderUI({
            sources: []
        });
        const sources: HTMLElement | null = container.querySelector("[data-testid='sources']");

        expect(sources).not.toBeNull();
        expect(sources).toHaveTextContent("No Sources Found");

    });

    it('should display "View" option for sources', () => {
        const {container} = renderUI({
            sources: [msfSource]
        });
        const viewButton: HTMLElement | null = container.querySelector("[data-testid='viewButton']");

        expect(viewButton).not.toBeNull();
        expect(viewButton).toHaveTextContent("View");

    });

    it('should not display "View" option when no sources are present', () => {
        const {container} = renderUI({
            sources: []
        });
        const viewButton: HTMLElement | null = container.querySelector("[data-testid='viewButton']");

        expect(viewButton).toBeNull();

    });

    it('should search for given source when input is given', () => {
        const spyOnSearch = jest.fn();
        const {container} = renderUI({
            onSearch: spyOnSearch,
        });

        const searchInputBox: HTMLElement | null = container.querySelector("[data-testid='sourcesSearch']");
        const searchSubmitButton: HTMLElement | null = container.querySelector("[data-testid='sourcesSearchButton']");

        if (searchInputBox !== null && searchSubmitButton !== null) {
            const searchInputElement = searchInputBox.children[0];
            fireEvent.change(searchInputElement, {target : {value :'CEIL Source'}});
            fireEvent.click(searchSubmitButton);
            expect(spyOnSearch).toHaveBeenCalledWith('CEIL Source');
        }
    });

    it('should give first page pagination details for the available 60 sources', () => {
        const spyOnPageChange = jest.fn();
        const {container, getAllByTitle} = renderUI({
            onPageChange: spyOnPageChange,
            numFound:60,
            page: 1
        });

        const pagination: HTMLElement | null = container.querySelector("[data-testid='sourcesPagination']");
        const previousPageIcon = getAllByTitle("Previous page");
        const nextPageIcon = getAllByTitle("Next page");

        if (pagination !== null) {
            expect(pagination.children[0]).toHaveTextContent("1-20 of 60");
            expect(previousPageIcon[0]).toBeDisabled();
            expect(nextPageIcon[0]).not.toBeDisabled();
        }
    });

    it('should give second page pagination details for the available 60 sources', () => {
        const spyOnPageChange = jest.fn();
        const {container, getAllByTitle} = renderUI({
            onPageChange: spyOnPageChange,
            numFound:60,
            page: 2
        });

        const pagination: HTMLElement | null = container.querySelector("[data-testid='sourcesPagination']");
        const previousPageIcon = getAllByTitle("Previous page");
        const nextPageIcon = getAllByTitle("Next page");

        if (pagination !== null) {
            expect(pagination.children[0]).toHaveTextContent("21-40 of 60");
            expect(previousPageIcon[0]).not.toBeDisabled();
            expect(nextPageIcon[0]).not.toBeDisabled();
        }
    });
});
