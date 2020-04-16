import IDGenerator from "shortid";

const shortRandomID = () => IDGenerator.generate();

export interface TestDictionary {
  name: string;
  shortCode: string;
  description: string;
  preferredSource: string;
  owner: string;
  ownerDisplayValue: string;
  ownerType: string;
  visibility: string;
  preferredLanguage: string;
  otherLanguages: string;
}

export function newDictionary(): [TestDictionary, string] {
  const owner = "admin";
  const dictionary = {
    name: "Test Dictionary",
    shortCode: "TD" + shortRandomID(),
    description: "Test dictionary",
    preferredSource: "CIEL", // todo stop hard coding this, pick the nth
    owner,
    ownerDisplayValue: `${owner}(You)`,
    ownerType: "users",
    visibility: "Public",
    preferredLanguage: "English (en)",
    otherLanguages: "French (fr)"
  };

  return [
    dictionary,
    `/${dictionary.ownerType}/${dictionary.owner}/collections/${dictionary.shortCode}/`
  ];
}

function select(labelText: string, item: string) {
  cy.findByLabelText(labelText).click();
  cy.findByText(item).click();
}

export function createDictionary(
  dictionaryAndUrl = newDictionary()
): [TestDictionary, string] {
  const [dictionary, dictionaryUrl] = dictionaryAndUrl;

  cy.visit("/user/collections/");

  cy.findByTitle("Create new dictionary").click();

  cy.findByLabelText("Dictionary Name").type(dictionary.name);
  cy.findByLabelText("Short Code").type(dictionary.shortCode);
  cy.findByLabelText("Description").type(dictionary.description);
  select("Preferred Source", dictionary.preferredSource);
  select("Owner", dictionary.ownerDisplayValue);
  select("Visibility", dictionary.visibility);
  select("Preferred Language", dictionary.preferredLanguage);

  select("Other Languages", dictionary.otherLanguages);
  cy.get("body").type("{esc}");
  cy.findByText("Submit").click();

  // wait for request to get done
  cy.findByText("General Details");

  // for other test files that makes use of us
  return [dictionary, dictionaryUrl];
}
