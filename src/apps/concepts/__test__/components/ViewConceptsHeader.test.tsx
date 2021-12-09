import React from "react";
import { render } from "../../../../test-utils.test";
import "@testing-library/jest-dom";
import ViewConceptsHeader from "../../components/ViewConceptsHeader";
import {
  SOURCE_CONTAINER,
  DICTIONARY_CONTAINER,
  DICTIONARY_VERSION_CONTAINER
} from "../../constants";
import { PREFERRED_SOURCES_VIEW_ONLY } from "../../../../utils/constants";
import { APISource } from "../../../sources";
import { APIDictionary } from "../../../dictionaries";
import { theme } from "../../../../App";
import { ThemeProvider } from "@mui/material/styles";

type viewConceptsHeaderProps = React.ComponentProps<typeof ViewConceptsHeader>;

const baseProps: viewConceptsHeaderProps = {
  containerType: "source",
  containerUrl: undefined,
  gimmeAUrl: function(arg1: string, arg2: string) {
    return arg2;
  },
  addConceptToDictionary: undefined,
  sources: [{ name: "test source", url: "/test/test123" } as APISource],
  dictionaries: [
    { name: "test dictionary", url: "/test/test123" } as APIDictionary
  ]
};

function renderUI(props: Partial<viewConceptsHeaderProps> = {}) {
  return render(
    <ThemeProvider theme={theme}>
      <ViewConceptsHeader {...baseProps} {...props} />
    </ThemeProvider>
  );
}

describe("ViewConceptHeader", () => {
  it("should match snapshot", () => {
    const { container } = renderUI();

    expect(container).toMatchSnapshot();
  });
});

describe("Header Title", () => {
  it("should show default title when containerType is not defined", () => {
    const { getByTestId } = renderUI({
      containerType: ""
    });

    const header = getByTestId("header");

    expect(header).toHaveTextContent("Concepts in undefined");
  });

  it("should show desired title when addToDictionary param is present and containerType is source", () => {
    const { getByTestId } = renderUI({
      containerType: SOURCE_CONTAINER,
      containerUrl: "/ownerType/owner/sources/sourceName/",
      addConceptToDictionary: "addConceptToDictionary"
    });

    const header = getByTestId("header");

    expect(header).toHaveTextContent("Import existing concept from sourceName");
  });

  it("should show desired title when addToDictionary param is absent and containerType is source", () => {
    const { getByTestId } = renderUI({
      containerType: SOURCE_CONTAINER,
      containerUrl: "/ownerType/owner/sources/sourceName/"
    });

    const header = getByTestId("header");

    expect(header).toHaveTextContent("Concepts in sourceName");
  });

  it("should show desired title based on containerUrl when containerType is dictionary", () => {
    const { getByTestId } = renderUI({
      containerType: DICTIONARY_CONTAINER,
      containerUrl: "/ownerType/owner/collections/collectionName/"
    });

    const header = getByTestId("header");

    expect(header).toHaveTextContent("Concepts in collectionName");
  });

  it("should show desired title based on containerUrl when containerType is dictionaryVersion", () => {
    const { getByTestId } = renderUI({
      containerType: DICTIONARY_VERSION_CONTAINER,
      containerUrl: "/ownerType/owner/collections/collectionName/version/"
    });

    const header = getByTestId("header");

    expect(header).toHaveTextContent("Concepts in vversion");
  });
});

describe("Switch Source", () => {
  it("should not show switch source when containerType is not defined", () => {
    const { getByTestId } = renderUI({
      containerType: ""
    });

    const header = getByTestId("header");

    expect(header).not.toHaveTextContent("Switch source");
  });

  it("should show switch source when addToDictionary param is present and containerType is source", () => {
    const { getByTestId } = renderUI({
      containerType: SOURCE_CONTAINER,
      containerUrl: "/ownerType/owner/sources/sourceName/",
      addConceptToDictionary: "addConceptToDictionary"
    });

    const header = getByTestId("header");

    expect(header).toHaveTextContent("Switch source (Currently sourceName)");
  });

  it("should not show switch source when addToDictionary param is absent and containerType is source", () => {
    const { getByTestId } = renderUI({
      containerType: SOURCE_CONTAINER,
      containerUrl: "/ownerType/owner/sources/sourceName/"
    });

    const header = getByTestId("header");

    expect(header).not.toHaveTextContent(
      "Switch source (Currently sourceName)"
    );
  });

  it("should not show switch source when containerType is dictionary", () => {
    const { getByTestId } = renderUI({
      containerType: DICTIONARY_CONTAINER,
      containerUrl: "/ownerType/owner/collections/collectionName/"
    });

    const header = getByTestId("header");

    expect(header).not.toHaveTextContent("Switch source");
  });

  it("should not show switch source when containerType is dictionaryVersion", () => {
    const { getByTestId } = renderUI({
      containerType: DICTIONARY_VERSION_CONTAINER,
      containerUrl: "/ownerType/owner/collections/collectionName/version/"
    });

    const header = getByTestId("header");

    expect(header).not.toHaveTextContent("Switch source");
  });

  it("should show available source name on clicking switch source", () => {
    const { getByTestId } = renderUI({
      containerType: SOURCE_CONTAINER,
      containerUrl: "/ownerType/owner/sources/sourceName/",
      addConceptToDictionary: "addConceptToDictionary"
    });

    const header = getByTestId("header");

    expect(header).toHaveTextContent("Switch source (Currently sourceName)");

    getByTestId("switch-source").click();

    Object.keys(PREFERRED_SOURCES_VIEW_ONLY).forEach(function(key) {
      expect(getByTestId(key)).not.toBeNull();
      expect(getByTestId(key)).toHaveTextContent(key);
    });
  });
});
