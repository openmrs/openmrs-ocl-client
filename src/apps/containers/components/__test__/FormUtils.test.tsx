import {
  showDefaultLocale,
  showOrganisationHeader,
  showUserName,
  showUserOrganisations,
  supportedLocalesLabel
} from "../FormUtils";
import { LOCALES } from "../../../../utils";
import {
  testAPIOrgList,
  testProfile
} from "../../../authentication/__test__/test_data";

describe("showUserName", () => {
  it("should return empty string if profile does not exists", () => {
    expect(showUserName(undefined)).toBe(null);
  });

  it("should return Menu Item if profile exists", () => {
    const menuItemProps = showUserName(testProfile)?.props.children;
    expect(menuItemProps.includes("(You)", "TestUser")).toBe(true);
  });
});

describe("showOrganisationHeader", () => {
  it("should return null if user is not part of any organisation", () => {
    expect(showOrganisationHeader([])).toBeNull();
  });

  it("should return Your Organisations Sub header if user is part of any organisation", () => {
    const organisationsSubHeader = showOrganisationHeader(testAPIOrgList)?.props
      .children;
    expect(organisationsSubHeader).toBe("Your Organizations");
  });
});

describe("showUserOrganisations", () => {
  it("should return null if user is not part of any organisation", () => {
    expect(showUserOrganisations([])).toBeNull();
  });

  it("should return all organisations user is part of", () => {
    const userOrganisations: JSX.Element[] | null = showUserOrganisations(
      testAPIOrgList
    );

    let expectedOrganisations: Array<String> = [];
    testAPIOrgList.forEach(userOrg => expectedOrganisations.push(userOrg.name));

    let actualUserOrganisations: Array<String> = [];
    userOrganisations?.forEach(function(userOrg) {
      actualUserOrganisations.push(userOrg.props.children);
    });

    expect(expectedOrganisations).toEqual(actualUserOrganisations);
  });
});

describe("showSupportedLocales", () => {
  it("should not include default locale in the supported locales", () => {
    const labels: Array<JSX.Element> = supportedLocalesLabel({
      default_locale: "en"
    });

    let expectedLocales: Array<String> = [];
    LOCALES.filter(({ value }) => value !== "en").forEach(({ label }) =>
      expectedLocales.push(label)
    );

    let actualLocales: Array<String> = [];
    labels?.forEach(function(value) {
      actualLocales.push(value.props.children);
    });

    expect(expectedLocales).toEqual(actualLocales);
  });

  it("should return all locales when default locale is empty", () => {
    const labels: Array<JSX.Element> = supportedLocalesLabel({
      default_locale: ""
    });

    let expectedLocales: Array<String> = [];
    LOCALES.forEach(({ label }) => expectedLocales.push(label));

    let actualLocales: Array<String> = [];
    labels?.forEach(function(value) {
      actualLocales.push(value.props.children);
    });

    expect(expectedLocales).toEqual(actualLocales);
  });
});

describe("showDefaultLocale", () => {
  it("should return all locales", () => {
    const labels: Array<JSX.Element> = showDefaultLocale();

    let expectedLocales: Array<String> = [];
    LOCALES.forEach(({ label }) => expectedLocales.push(label));

    let actualLocales: Array<String> = [];
    labels?.forEach(function(value) {
      actualLocales.push(value.props.children);
    });

    expect(expectedLocales).toEqual(actualLocales);
  });
});
