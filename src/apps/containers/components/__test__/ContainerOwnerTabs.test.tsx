import React from 'react';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom'
import {BrowserRouter as Router} from "react-router-dom";
import {ContainerOwnerTabs} from "../index";
import {TabType} from "../../types";
import {fireEvent} from "@testing-library/dom";

type ownerTabsProps = React.ComponentProps<typeof ContainerOwnerTabs>;

const tabs: TabType[] = [
    {
        labelName: "Your Cards",
        labelURL: "/user/cards/",
    },
    {
        labelName: "Public Cards",
        labelURL: "/cards/",
    },
    {
        labelName: "Your Organizations' Cards",
        labelURL: "/user/orgs/cards/",
    },
];


const baseProps: ownerTabsProps = {
    currentPageUrl : "/user/orgs/cards/",
    tabList : []
};

function renderUI(props: Partial<ownerTabsProps> = {}) {
    return render(
        <Router>
            <ContainerOwnerTabs {...baseProps} {...props} />
        </Router>
    );
}
describe('ContainerOwnerTabs', () => {
    it('should display all the tabs and on click of "Your Cards" it should open corresponding page', () => {
        const {container, getByText} = renderUI({
            currentPageUrl: "/cards/",
            tabList: tabs
        });
        const tabsComponent: HTMLElement | null = container.querySelector("[data-testid='tabs']");
        const yourCardsTab: HTMLElement | null = container.querySelector("[data-testid='tab - 0']");
        const publicCardsTab: HTMLElement | null = container.querySelector("[data-testid='tab - 1']");
        const orgCardsTab: HTMLElement | null = container.querySelector("[data-testid='tab - 2']");


        expect(tabsComponent).not.toBeNull();
        expect(yourCardsTab).toHaveTextContent("Your Cards");
        expect(publicCardsTab).toHaveTextContent("Public Cards");
        expect(orgCardsTab).toHaveTextContent("Your Organizations' Cards");
        fireEvent.click(getByText("Your Cards"));
        expect(location.pathname).toBe("/user/cards/");
    });

    it('should display all the tabs and on click of "Public Cards" it should open corresponding page', () => {
        const {container, getByText} = renderUI({
            tabList: tabs
        });
        const tabsComponent: HTMLElement | null = container.querySelector("[data-testid='tabs']");
        const yourCardsTab: HTMLElement | null = container.querySelector("[data-testid='tab - 0']");
        const publicCardsTab: HTMLElement | null = container.querySelector("[data-testid='tab - 1']");
        const orgCardsTab: HTMLElement | null = container.querySelector("[data-testid='tab - 2']");


        expect(tabsComponent).not.toBeNull();
        expect(yourCardsTab).toHaveTextContent("Your Cards");
        expect(publicCardsTab).toHaveTextContent("Public Cards");
        expect(orgCardsTab).toHaveTextContent("Your Organizations' Cards");
        fireEvent.click(getByText("Public Cards"));
        expect(location.pathname).toBe("/cards/");
    });

    it('should display all the tabs and on click of "Your Organizations\' Cards" it should open corresponding page', () => {
        const {container, getByText} = renderUI({
            tabList: tabs
        });
        const tabsComponent: HTMLElement | null = container.querySelector("[data-testid='tabs']");
        const yourCardsTab: HTMLElement | null = container.querySelector("[data-testid='tab - 0']");
        const publicCardsTab: HTMLElement | null = container.querySelector("[data-testid='tab - 1']");
        const orgCardsTab: HTMLElement | null = container.querySelector("[data-testid='tab - 2']");


        expect(tabsComponent).not.toBeNull();
        expect(yourCardsTab).toHaveTextContent("Your Cards");
        expect(publicCardsTab).toHaveTextContent("Public Cards");
        expect(orgCardsTab).toHaveTextContent("Your Organizations' Cards");
        fireEvent.click(getByText("Your Organizations' Cards"));
        expect(location.pathname).toBe("/user/orgs/cards/");
    });

});