import React from "react";
import SourceConceptDetails from "../../../../apps/sources/components/SourceConceptsSummary";
import { render } from "../../../../test-utils";
import "@testing-library/jest-dom";
import { APISource } from "../../types";

type sourceDetailsProps = React.ComponentProps<typeof SourceConceptDetails>;

const totalConcepts = 3;
const activeConcepts = 2;
const msfSource: APISource = {
  id: "MSF-SOURCE",
  short_code: "MSF-SRC",
  name: "MSF Source",
  full_name: "MSF Source",
  source_type: "Dictionary",
  public_access: "View",
  default_locale: "en",
  website: "http://msf.org/",
  description:
    "A universal code system for identifying laboratory and clinical observations.",
  extras: { msf_extra_field: "msf_extra_value" },
  url: "/users/root/sources/MSF-SRC/",
  owner: "root",
  owner_type: "User",
  owner_url: "/users/root/",
  external_id: "123",
  supported_locales: ["en", "fr"],
  custom_validation_schema: "Dictionary",
  active_concepts: 2,
  concepts_url: "",
};
const baseProps: sourceDetailsProps = {
  source: msfSource,
  totalConceptCount: totalConcepts,
  activeConceptCount: activeConcepts
};

function renderUI(props: Partial<sourceDetailsProps> = {}) {
  return render(<SourceConceptDetails {...baseProps} {...props} />);
}

describe("SourceDetails", () => {
  it("should match snapshot", () => {
    const { container } = renderUI(baseProps);

    expect(container).toMatchSnapshot();
  });
});

describe("Source Concept Summary", () => {
  it("checks total number of concepts", () => {
    const { container } = renderUI(baseProps);

    const conceptsSummary: HTMLElement | null = container.querySelector(
      "[data-testid='concepts-summary']"
    );

    expect(conceptsSummary).not.toBeNull();
    expect(conceptsSummary).toHaveTextContent("Total Concepts: 3");
  });

  it("checks total number of active concepts", () => {
    const { container } = renderUI(baseProps);

    const conceptsSummary: HTMLElement | null = container.querySelector(
        "[data-testid='concepts-summary']"
    );

    expect(conceptsSummary).not.toBeNull();
    expect(conceptsSummary).toHaveTextContent("Active Concepts: 2");
  });

  it("checks total number of retired concepts", () => {
    const { container } = renderUI(baseProps);

    const conceptsSummary: HTMLElement | null = container.querySelector(
        "[data-testid='concepts-summary']"
    );

    expect(conceptsSummary).not.toBeNull();
    expect(conceptsSummary).toHaveTextContent("Retired Concepts: 1");
  });
});
