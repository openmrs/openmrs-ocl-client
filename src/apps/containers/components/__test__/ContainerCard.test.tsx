import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import ContainerCard from "../ContainerCard";
import { fireEvent } from "@testing-library/dom";

type cardProps = React.ComponentProps<typeof ContainerCard>;

const baseProps: cardProps = {
  name: "",
  short_code: "",
  owner: "",
  owner_type: "",
  description: "",
  url: "",
  index: 1
};

function renderUI(props: Partial<cardProps> = {}) {
  return render(
    <Router>
      <ContainerCard {...baseProps} {...props} />
    </Router>
  );
}
describe("ContainerCard", () => {
  it("should display given shortCode and name and owner and description", () => {
    const { container } = renderUI({
      name: "TestCard",
      short_code: "testCard",
      owner: "root",
      owner_type: "User",
      description:
        "A universal system for identifying laboratory and clinical observations.",
      url: "/users/root/cards/testCard/"
    });

    const cardShortCode: HTMLElement | null = container.querySelector(
      "[data-testid='shortCode-1']"
    );
    const cardName: HTMLElement | null = container.querySelector(
      "[data-testid='name-1']"
    );
    const cardOwner: HTMLElement | null = container.querySelector(
      "[data-testid='owner-1']"
    );
    const cardDescription: HTMLElement | null = container.querySelector(
      "[data-testid='description-1']"
    );

    expect(cardShortCode).not.toBeNull();
    expect(cardName).not.toBeNull();
    expect(cardOwner).not.toBeNull();
    expect(cardDescription).not.toBeNull();

    expect(cardShortCode).toHaveTextContent("testCard");
    expect(cardName).toHaveTextContent("TestCard");
    expect(cardOwner).toHaveTextContent("User/root");
    expect(cardDescription).toHaveTextContent(
      "A universal system for identifying laboratory and clinical observations."
    );
  });

  it("should display shortCode and name and owner but empty description", () => {
    const { container } = renderUI({
      name: "TestCard",
      short_code: "testCard",
      owner: "root",
      owner_type: "User",
      url: "/users/root/cards/testCard/"
    });

    const cardShortCode: HTMLElement | null = container.querySelector(
      "[data-testid='shortCode-1']"
    );
    const cardName: HTMLElement | null = container.querySelector(
      "[data-testid='name-1']"
    );
    const cardOwner: HTMLElement | null = container.querySelector(
      "[data-testid='owner-1']"
    );
    const cardDescription: HTMLElement | null = container.querySelector(
      "[data-testid='description-1']"
    );

    expect(cardShortCode).not.toBeNull();
    expect(cardName).not.toBeNull();
    expect(cardOwner).not.toBeNull();
    expect(cardDescription).not.toBeNull();

    expect(cardShortCode).toHaveTextContent("testCard");
    expect(cardName).toHaveTextContent("TestCard");
    expect(cardOwner).toHaveTextContent("User/root");
    expect(cardDescription).toHaveTextContent("");
  });

  it("should display view option and on its click page should redirect to given url", () => {
    const { container } = renderUI({
      url: "/users/root/cards/testCard/"
    });

    const viewButton: HTMLElement | null = container.querySelector(
      "[data-testid='viewButton-1']"
    );

    expect(viewButton).not.toBeNull();
    expect(viewButton).toHaveTextContent("View");

    viewButton !== null && fireEvent.click(viewButton);

    expect(location.pathname).toBe("/users/root/cards/testCard/");
  });
});
