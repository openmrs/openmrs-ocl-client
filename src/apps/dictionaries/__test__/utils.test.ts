import { dictionaryNameFromUrl } from "../utils";

describe("dictionaryNameFromUrl", () => {
  it("should return undefined if url is empty", () => {
    expect(dictionaryNameFromUrl("")).toBeUndefined();
  });

  it("should return dictionary name based on url", () => {
    expect(
      dictionaryNameFromUrl("/users/john/collections/testDictonary/")
    ).toEqual("testDictonary");
  });
});
