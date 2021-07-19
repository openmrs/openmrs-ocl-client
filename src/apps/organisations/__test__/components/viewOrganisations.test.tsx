import React from "react";
import ViewOrganisations from "../../components/ViewOrgs";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";

const organisations = [
  {
    type: "Organization",
    uuid: "1",
    id: "T1",
    public_access: "View",
    name: "Test organisation 1",
    company: "Test company",
    website: "https://test.com",
    location: "Belgium",
    members: 0,
    created_on: "2021-01-17T03:16:55.561172Z",
    updated_on: "2021-01-17T03:16:55.561197Z",
    url: "/orgs/T1/",
    extras: null,
    created_by: "ocladmin",
    updated_by: "ocladmin",
    sources_url: "/orgs/T1/sources/",
    public_sources: 1,
    collections_url: "/orgs/T1/collections/",
    public_collections: 0,
    logo_url: null,
    description: null,
    text: null,
    internal_reference_id: null
  },
  {
    type: "Organization",
    uuid: "2",
    id: "T2",
    public_access: "View",
    name: "Test organisation 2",
    company: "Test org",
    website: "https://www.ama-assn.org/",
    location: "Uganda",
    members: 0,
    created_on: "2021-06-09T18:59:17.842034Z",
    updated_on: "2021-06-09T18:59:17.842058Z",
    url: "/orgs/T2/",
    extras: {},
    created_by: "ocladmin",
    updated_by: "ocladmin",
    sources_url: "/orgs/T2/sources/",
    public_sources: 1,
    collections_url: "/orgs/T2/collections/",
    public_collections: 0,
    logo_url: null,
    description: "",
    text: "",
    internal_reference_id: null
  }
];

type viewOrgsProps = React.ComponentProps<typeof ViewOrganisations>;

const baseProps: viewOrgsProps = {
  organisations: [],
  numFound: 10,
  onPageChange: function onPageChange() {},
  onSearch: function onSearch() {},
  page: 1,
  perPage: 20,
  initialQ: "",
  title: ""
};

function renderOrgsUI(props: Partial<viewOrgsProps> = {}) {
  return render(
    <Router>
      <ViewOrganisations {...baseProps} {...props} />
    </Router>
  );
}

describe("ViewOrganisations", () => {
  it("should display orgId and name and orgUrl of the respective org that are present", () => {
    const { container, getAllByTestId } = renderOrgsUI({
      organisations: organisations,
      title: "Organisations"
    });

    const noCards: HTMLElement | null = container.querySelector(
      "[data-testid='noCards']"
    );

    expect(noCards).toBeNull();

    expect(getAllByTestId("org-id-0")[0]).toHaveTextContent("T1");
    expect(getAllByTestId("org-id-1")[0]).toHaveTextContent("T2");

    expect(getAllByTestId("name-0")[0]).toHaveTextContent(
      "Test organisation 1"
    );
    expect(getAllByTestId("name-1")[0]).toHaveTextContent(
      "Test organisation 2"
    );

    expect(getAllByTestId("url-0")[0]).toHaveTextContent("orgs/T1");
    expect(getAllByTestId("url-1")[0]).toHaveTextContent("orgs/T2");

    expect(getAllByTestId("viewButton-0")[0]).toHaveTextContent("View");
  });

  it('should display "No Organisation Found" when no orgs are present', () => {
    const { container } = renderOrgsUI({
      organisations: [],
      title: "Organisations"
    });
    const orgs: HTMLElement | null = container.querySelector(
      "[data-testid='noCards']"
    );

    expect(orgs).not.toBeNull();
    expect(orgs).toHaveTextContent("No Organisations");
  });

  it("should search for given organisation when input is given", () => {
    const spyOnSearch = jest.fn();
    const { container } = renderOrgsUI({
      onSearch: spyOnSearch
    });

    const searchInputBox: HTMLElement | null = container.querySelector(
      "[data-testid='searchInput']"
    );
    const searchSubmitButton: HTMLElement | null = container.querySelector(
      "[data-testid='searchButton']"
    );

    if (searchInputBox !== null && searchSubmitButton !== null) {
      const searchInputElement = searchInputBox.children[0];
      fireEvent.change(searchInputElement, {
        target: { value: "Test org" }
      });
      fireEvent.click(searchSubmitButton);
      expect(spyOnSearch).toHaveBeenCalledWith("Test org");
    }
  });

  it("should render page pagination details on page1 well", () => {
    const spyOnPageChange = jest.fn();
    const { container, getAllByTitle } = renderOrgsUI({
      onPageChange: spyOnPageChange,
      numFound: 50,
      page: 1
    });

    const pagination: HTMLElement | null = container.querySelector(
      "[data-testid='pagination']"
    );
    const previousPageIcon = getAllByTitle("Previous page");
    const nextPageIcon = getAllByTitle("Next page");

    if (pagination !== null) {
      expect(pagination.children[0]).toHaveTextContent("1-20 of 50");
      expect(previousPageIcon[0]).toBeDisabled();
      expect(nextPageIcon[0]).not.toBeDisabled();
    }
  });

  it("should render page pagination details on page2 well", () => {
    const spyOnPageChange = jest.fn();
    const { container, getAllByTitle } = renderOrgsUI({
      onPageChange: spyOnPageChange,
      numFound: 50,
      page: 2
    });

    const pagination: HTMLElement | null = container.querySelector(
      "[data-testid='pagination']"
    );
    const previousPageIcon = getAllByTitle("Previous page");
    const nextPageIcon = getAllByTitle("Next page");

    if (pagination !== null) {
      expect(pagination.children[0]).toHaveTextContent("21-40 of 50");
      expect(previousPageIcon[0]).not.toBeDisabled();
      expect(nextPageIcon[0]).not.toBeDisabled();
    }
  });
});
