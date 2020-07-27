import React from 'react';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom'
import {BrowserRouter as Router} from "react-router-dom";
import ContainerCards, {Card} from "../ContainerCards";

type cardsProps = React.ComponentProps<typeof ContainerCards>;

const msfCard :Card = {
    short_code: "MSF-CRD",
    name: "MSF Card",
    description: "A universal code system for identifying laboratory and clinical observations.",
    url:"/users/root/sources/MSF-SRC/",
    owner:"root",
    owner_type:"User",
};

const ceilCard :Card = {
    short_code: "CEIL-CRD",
    name: "CEIL Card",
    description: "A universal code system for identifying laboratory and clinical observations.",
    url:"/users/root/sources/MSF-SRC/",
    owner:"root",
    owner_type:"User",
};


const baseProps: cardsProps = {
    cards: [],
    title: ""
};

function renderUI(props: Partial<cardsProps> = {}) {
    return render(
        <Router>
            <ContainerCards {...baseProps} {...props} />
        </Router>
    );
}
describe('ContainerCards', () => {
    it('should display "No Dictionaries" message when no cards are available and title is given as Dictionaries ', () => {
        const {container} = renderUI({
            cards: [],
            title: "Dictionaries"
        });

        const noCards: HTMLElement | null = container.querySelector("[data-testid='noCards']");
        const availableCards: HTMLElement | null = container.querySelector("[data-testid='cards']");

        expect(noCards).not.toBeNull();
        expect(availableCards).toBeNull();
        expect(noCards).toHaveTextContent("No Dictionaries");
    });

    it('should display shortCodes and names and owners and descriptions for the available cards ', () => {
        const {container, getAllByTestId} = renderUI({
            cards: [msfCard, ceilCard],
            title: "Sources"
        });

        const noCards: HTMLElement | null = container.querySelector("[data-testid='noCards']");

        expect(noCards).toBeNull();

        expect(getAllByTestId('shortCode').length).toBe(2);
        expect(getAllByTestId('shortCode')[0]).toHaveTextContent("MSF-CRD");
        expect(getAllByTestId('shortCode')[1]).toHaveTextContent("CEIL-CRD");

        expect(getAllByTestId('name').length).toBe(2);
        expect(getAllByTestId('name')[0]).toHaveTextContent("MSF Card");
        expect(getAllByTestId('name')[1]).toHaveTextContent("CEIL Card");

        expect(getAllByTestId('owner').length).toBe(2);
        expect(getAllByTestId('description').length).toBe(2);
        expect(getAllByTestId('viewButton').length).toBe(2);

    });
});
