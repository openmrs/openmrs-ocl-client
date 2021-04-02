import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { fireEvent } from "@testing-library/dom";
import ContainerSearch from "../ContainerSearch";

type searchProps = React.ComponentProps<typeof ContainerSearch>;

const baseProps: searchProps = {
  title: "",
  onSearch: function onPageChange() {},
  initialQ: ""
};

function renderUI(props: Partial<searchProps> = {}) {
  return render(
    <Router>
      <ContainerSearch {...baseProps} {...props} />
    </Router>
  );
}
describe("ContainerSearch", () => {
  it("should search for given card when input is given", () => {
    const spyOnSearch = jest.fn();
    const { container } = renderUI({
      onSearch: spyOnSearch
    });

    const searchInputBox: HTMLElement | null = container.querySelector(
      "[data-testid='searchInput']"
    );
    const searchSubmitButton: HTMLElement | null = container.querySelector(
      "[data-testid='searchButton']"
    );

    expect(searchInputBox).not.toBeNull();
    expect(searchSubmitButton).not.toBeNull();
    if (searchInputBox !== null && searchSubmitButton !== null) {
      const searchInputElement = searchInputBox.children[0];
      fireEvent.change(searchInputElement, { target: { value: "Test Card" } });
      fireEvent.click(searchSubmitButton);
      expect(spyOnSearch).toHaveBeenCalledWith("Test Card");
    }
  });

  it('should have placeholder as "Search Cards" when title is given as "Cards"', () => {
    const { container, debug } = renderUI({
      title: "Cards"
    });

    const searchInputBox: HTMLElement | null = container.querySelector(
      "[data-testid='searchInput']"
    );

    expect(searchInputBox).not.toBeNull();
    if (searchInputBox !== null) {
      const searchInputElement = searchInputBox.children[0];
      expect(searchInputElement.getAttribute("placeholder")).toBe(
        "Search Cards"
      );
    }
  });
});
