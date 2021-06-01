import { buildPartialSearchQuery, findLocale } from "../../utils";

describe("findLocale", () => {
  it("should find the right locale", () => {
    expect(findLocale("fr")).toStrictEqual({
      value: "fr",
      label: "French (fr)"
    });
  });
  it("should fallback to the right locale", () => {
    expect(findLocale("does not exist", "en")).toStrictEqual({
      value: "en",
      label: "English (en)"
    });
  });
});

export {};
