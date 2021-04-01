///<reference path="../../../../../node_modules/@types/testing-library__dom/queries.d.ts"/>
import React from "react";
import "@testing-library/jest-dom";
import { render } from "../../../../test-utils";

import { ViewSourcesPage } from "../../components/index";
import routeData from "react-router";

const mockLocation = {
  pathname: "/sources/",
  hash: "",
  search: "",
  state: ""
};
beforeEach(() => {
  jest.spyOn(routeData, "useLocation").mockReturnValue(mockLocation);
});

type viewSourcesPageProps = React.ComponentProps<typeof ViewSourcesPage>;

const baseProps: viewSourcesPageProps = {
  sources: [],
  loading: false,
  meta: {},
  retrieveSources: function() {}
};

function renderUI(props: Partial<viewSourcesPageProps> = {}) {
  return render(<ViewSourcesPage {...baseProps} {...props} />);
}
describe("ViewSourcesPage", () => {
  it("should match snapshot and it should have all the child components", () => {
    const { container } = renderUI({
      loading: true
    });
    const headerComponent: HTMLElement | null = container.querySelector(
      "[data-testid='header']"
    );
    const containerOwnerTabsComponent: HTMLElement | null = container.querySelector(
      "[data-testid='tabs']"
    );
    const progressOverlayComponent: HTMLElement | null = container.querySelector(
      "[data-testid='loader-message']"
    );
    const viewSourcesComponent: HTMLElement | null = container.querySelector(
      "[data-testid='cards']"
    );

    expect(container).toMatchSnapshot();
    expect(headerComponent).not.toBeNull();
    expect(containerOwnerTabsComponent).not.toBeNull();
    expect(progressOverlayComponent).not.toBeNull();
    expect(viewSourcesComponent).not.toBeNull();
  });

  it('should show "Loading" message when loading is true', () => {
    const { container } = renderUI({
      loading: true
    });
    const loadingOverLay: HTMLElement | null = container.querySelector(
      "[data-testid='loader-message']"
    );
    expect(loadingOverLay).toHaveTextContent("Loading...");
    expect(loadingOverLay).not.toBeNull();
  });

  it('should not show "Loading" message when loading is false', () => {
    const { container } = renderUI({
      loading: false
    });
    const loadingOverLay = container.querySelector(
      "[data-testid='loader-message']"
    );
    expect(loadingOverLay).toBeNull();
  });

  it('should display search bar and pagination and "No Sources" message', () => {
    const { container } = renderUI({
      loading: false
    });
    const sourcesSearch: HTMLElement | null = container.querySelector(
      "[data-testid='searchInput']"
    );
    const viewSources: HTMLElement | null = container.querySelector(
      "[data-testid='cards']"
    );
    const pagination: HTMLElement | null = container.querySelector(
      "[data-testid='pagination']"
    );
    expect(sourcesSearch).not.toBeNull();
    expect(viewSources).toHaveTextContent("No Sources");
    expect(pagination).not.toBeNull();
    if (pagination !== null) {
      expect(pagination.children[0]).toHaveTextContent("0-0 of 0");
    }
  });

  it("should call retrieveSources method page render", () => {
    const retrieveSourcesMock = jest.fn();
    const { container } = renderUI({
      loading: false,
      retrieveSources: retrieveSourcesMock
    });
    expect(retrieveSourcesMock).toHaveBeenCalled();
  });
});
