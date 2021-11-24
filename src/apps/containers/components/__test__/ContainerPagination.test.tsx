import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import ContainerPagination from "../ContainerPagination";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../App";

type paginationProps = React.ComponentProps<typeof ContainerPagination>;

const baseProps: paginationProps = {
  num_found: 50,
  per_page: 10,
  page: 2,
  onPageChange: function onPageChange() {}
};

function renderUI(props: Partial<paginationProps> = {}) {
  return render(
    <Router>
      <ThemeProvider theme={theme}>
        <ContainerPagination {...baseProps} {...props} />
      </ThemeProvider>
    </Router>
  );
}
describe("ContainerPagination", () => {
  it("should give first page pagination details for the available 60 cards", () => {
    const spyOnPageChange = jest.fn();
    const { container, getAllByTitle } = renderUI({
      onPageChange: spyOnPageChange,
      num_found: 60,
      per_page: 10,
      page: 1
    });

    const pagination: HTMLElement | null = container.querySelector(
      "[data-testid='pagination']"
    );
    const previousPageIcon = getAllByTitle("Go to previous page");
    const nextPageIcon = getAllByTitle("Go to next page");

    expect(pagination).not.toBeNull();
    if (pagination !== null) {
      expect(pagination.children[0]).toHaveTextContent("1-10 of 60");
      expect(previousPageIcon[0]).toBeDisabled();
      expect(nextPageIcon[0]).not.toBeDisabled();
    }
  });

  it("should give second page pagination details with 20 cards per page  ", () => {
    const spyOnPageChange = jest.fn();
    const { container, getAllByTitle } = renderUI({
      onPageChange: spyOnPageChange,
      num_found: 60,
      per_page: 20,
      page: 2
    });

    const pagination: HTMLElement | null = container.querySelector(
      "[data-testid='pagination']"
    );
    const previousPageIcon = getAllByTitle("Go to previous page");
    const nextPageIcon = getAllByTitle("Go to next page");

    expect(pagination).not.toBeNull();
    if (pagination !== null) {
      expect(pagination.children[0]).toHaveTextContent("21-40 of 60");
      expect(previousPageIcon[0]).not.toBeDisabled();
      expect(nextPageIcon[0]).not.toBeDisabled();
    }
  });

  it("should give third page pagination details for the available 50 cards with 20 cards per page  ", () => {
    const spyOnPageChange = jest.fn();
    const { container, getAllByTitle } = renderUI({
      onPageChange: spyOnPageChange,
      num_found: 50,
      per_page: 20,
      page: 3
    });

    const pagination: HTMLElement | null = container.querySelector(
      "[data-testid='pagination']"
    );
    const previousPageIcon = getAllByTitle("Go to previous page");
    const nextPageIcon = getAllByTitle("Go to next page");

    expect(pagination).not.toBeNull();
    if (pagination !== null) {
      expect(pagination.children[0]).toHaveTextContent("41-50 of 50");
      expect(previousPageIcon[0]).not.toBeDisabled();
      expect(nextPageIcon[0]).toBeDisabled();
    }
  });
});
