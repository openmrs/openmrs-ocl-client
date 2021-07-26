import { getSourceTypeFromPreviousPath } from "../utils";

describe("getSourceTypeFromPreviousPath", () => {
  it("should return public sources for /sources/", () => {
    expect(getSourceTypeFromPreviousPath("/sources/")).toEqual(
      "All Public Concepts"
    );
  });

  it("should return your sources for /user/sources/", () => {
    expect(getSourceTypeFromPreviousPath("/user/sources/")).toEqual(
      "Your Sources"
    );
  });

  it("should return organisation sources for /user/orgs/sources/", () => {
    expect(getSourceTypeFromPreviousPath("/user/orgs/sources/")).toEqual(
      "Your Organisations' Sources"
    );
  });

  it("should return sources for any other", () => {
    expect(getSourceTypeFromPreviousPath("/test/")).toEqual("Sources");
  });
});
