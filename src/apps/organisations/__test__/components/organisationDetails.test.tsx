import React from "react";
import OrganisationDetails from "../../components/OrgDetails";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";

const organisation = {
    "type":"Organization",
    "uuid":"1",
    "id":"T1",
    "public_access":"View",
    "name":"Test organisation 1",
    "company":"Test company",
    "website":"https://test.com",
    "location":"Belgium",
    "members":0,
    "members_url": "",
    "created_on":"2021-01-17T03:16:55.561172Z",
    "updated_on":"2021-01-17T03:16:55.561197Z",
    "url":"/orgs/T1/",
    "extras":null,
    "created_by":"ocladmin",
    "updated_by":"ocladmin",
    "sources_url":"/orgs/T1/sources/",
    "public_sources":1,
    "collections_url":"/orgs/T1/collections/",
    "public_collections":0,
  };

type OrgDetailProps = React.ComponentProps<typeof OrganisationDetails>;

function renderUI(props: OrgDetailProps) {
    return render(
        <Router>
            <OrganisationDetails {...props} />
        </Router>
    );
}

describe("OrganisationDetail", () => {
    it("should match snapshot", () => {
        const { container } = renderUI({
            organisation
        });
    
        expect(container).toMatchSnapshot();
      });
    
    it("should display name, company, website, location and access of the organisation", () => {
        const { getByText } = renderUI({ organisation });

        expect(getByText("Details")).toBeInTheDocument();
        expect(getByText("Name")).toBeInTheDocument();
        expect(getByText("Test organisation 1")).toBeInTheDocument();

        expect(getByText("Website")).toBeInTheDocument();
        expect(getByText("https://test.com")).toBeInTheDocument();

        expect(getByText("Public Access")).toBeInTheDocument();
        expect(getByText("View")).toBeInTheDocument();

        expect(getByText("Company")).toBeInTheDocument();
        expect(getByText("Test company")).toBeInTheDocument();

        expect(getByText("Location")).toBeInTheDocument();
        expect(getByText("Belgium")).toBeInTheDocument();
    });
});
