import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import ContainerCards, { Card } from "../ContainerCards";

type cardsProps = React.ComponentProps<typeof ContainerCards>;

const msfCard: Card = {
  short_code: "MSF-CRD",
  name: "MSF Card",
  description:
    "A universal code system for identifying laboratory and clinical observations.",
  url: "/users/root/sources/MSF-SRC/",
  owner: "root",
  owner_type: "User"
};

const ceilCard: Card = {
  short_code: "CEIL-CRD",
  name: "CEIL Card",
  description:
    "A universal code system for identifying laboratory and clinical observations.",
  url: "/users/root/sources/MSF-SRC/",
  owner: "root",
  owner_type: "User"
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
describe("ContainerCards", () => {
  it('should display "No Dictionaries" message when no cards are available and title is given as Dictionaries ', () => {
    const { container } = renderUI({
      cards: [],
      title: "Dictionaries"
    });

    const cardsComponent: HTMLElement | null = container.querySelector(
      "[data-testid='cards']"
    );
    const noCards: HTMLElement | null = container.querySelector(
      "[data-testid='noCards']"
    );

    expect(noCards).not.toBeNull();
    expect(cardsComponent).not.toBeNull();
    expect(noCards).toHaveTextContent("No Dictionaries");
  });

  it("should display shortCodes and names and owners and descriptions for the available cards ", () => {
    const { container, getAllByTestId } = renderUI({
      cards: [msfCard, ceilCard],
      title: "Sources"
    });

    const noCards: HTMLElement | null = container.querySelector(
      "[data-testid='noCards']"
    );
    const cardsComponent: HTMLElement | null = container.querySelector(
      "[data-testid='cards']"
    );

    expect(noCards).toBeNull();
    expect(cardsComponent).not.toBeNull();

    expect(getAllByTestId("shortCode-0")[0]).toHaveTextContent("MSF-CRD");
    expect(getAllByTestId("shortCode-1")[0]).toHaveTextContent("CEIL-CRD");

    expect(getAllByTestId("name-0")[0]).toHaveTextContent("MSF Card");
    expect(getAllByTestId("name-1")[0]).toHaveTextContent("CEIL Card");

    expect(getAllByTestId("description-0")[0]).toHaveTextContent(
      "A universal code system for identifying laboratory and clinical observations."
    );
    expect(getAllByTestId("description-1")[0]).toHaveTextContent(
      "A universal code system for identifying laboratory and clinical observations."
    );

    expect(getAllByTestId("viewButton-0")[0]).toHaveTextContent("View");
    expect(getAllByTestId("viewButton-1")[0]).toHaveTextContent("View");
  });
});
