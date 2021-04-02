import { canModifyConcept } from "../utils";

describe("canModifyConcept", () => {
  const profile: any = {
    username: "Foo"
  };

  const usersOrgs: any = {
    id: "Foo"
  };

  it("should return false if CONCEPT_PATTERN doesn`t match conceptUrl", () => {
    const conceptUrl = "/orgs/Foo/sources/Foo/";
    expect(canModifyConcept(conceptUrl, profile, [usersOrgs])).toBe(false);
  });

  it("should return true if owner type is org, CONCEPT_PATTERN matches conceptUrl and profile username matches owner name", () => {
    const conceptUrl = "/orgs/Foo/sources/Foo/concepts/Foo/";
    expect(canModifyConcept(conceptUrl, profile, [usersOrgs])).toBe(true);
  });

  it("should return false if owner type is org, CONCEPT_PATTERN matches conceptUrl and profile username doesn`t matches owner name", () => {
    const conceptUrl = "/orgs/FooFa/sources/Foo/concepts/Foo/";
    expect(canModifyConcept(conceptUrl, profile, [usersOrgs])).toBe(false);
  });

  it("should return true if owner type is user, CONCEPT_PATTERN matches conceptUrl and profile username matches owner name", () => {
    const conceptUrl = "/users/Foo/sources/Foo/concepts/Foo/";
    expect(canModifyConcept(conceptUrl, profile, [usersOrgs])).toBe(true);
  });

  it("should return false if owner type is user, CONCEPT_PATTERN matches conceptUrl and profile username doesn`t matches owner name", () => {
    const conceptUrl = "/users/FooFa/sources/Foo/concepts/Foo/";
    expect(canModifyConcept(conceptUrl, profile, [usersOrgs])).toBe(false);
  });
});
