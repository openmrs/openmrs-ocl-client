import IDGenerator from "shortid";

const shortRandomID = () => {
  IDGenerator.characters(
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-."
  );
  return IDGenerator.generate();
};

export interface TestConcept {
  id: string;
  class: string;
  datatype: string;
  names: {
    name: string;
    type: string;
    language: string;
    preferredInLanguage: string;
  }[];
  descriptions: {
    description: string;
    language: string;
    preferredInLanguage: string;
  }[];
  answers: {
    source: { search: string; select: string };
    concept: { search: string; select: string };
  }[];
  sets: {
    source: { search: string; select: string };
    concept: { search: string; select: string };
  }[];
  mappings: {
    source: { search: string; select: string };
    relationship: string;
    concept: { search: string; select: string };
  }[];
}

export function newConcept(
  ownerType: string,
  owner: string,
  shortCode: string
): [TestConcept, string] {
  const randomString = shortRandomID();
  const id = `TestConcept1-${randomString}`;

  const concept = {
    id,
    class: "Drug",
    datatype: "Coded",
    names: [
      {
        name: `TestConcept One ${randomString}`,
        type: "Fully Specified",
        language: "English (en)",
        preferredInLanguage: "Yes"
      },
      {
        name: `TestConcept Uń ${randomString}`,
        type: "Synonym",
        language: "French (fr)",
        preferredInLanguage: "Yes"
      },
      {
        name: `TestConcept Ein ${randomString}`,
        type: "Synonym",
        language: "German (de)",
        preferredInLanguage: "No"
      }
    ],
    descriptions: [
      {
        description: `TestConcept One ${randomString}`,
        language: "English (en)",
        preferredInLanguage: "Yes"
      },
      {
        description: `TestConcept Uń ${randomString}`,
        language: "French (fr)",
        preferredInLanguage: "No"
      }
    ],
    answers: [
      {
        source: { search: "CIEL", select: "CIEL" },
        concept: { search: "1983", select: "1983- Unable to drink fluids" }
      },
      {
        source: { search: "CIEL", select: "CIEL" },
        concept: { search: "1944", select: "1944- Beaten earth" }
      }
    ],
    sets: [
      {
        source: { search: "CIEL", select: "CIEL" },
        concept: { search: "1943", select: "1943- Cement" }
      }
    ],
    mappings: [
      {
        source: { search: "CIEL", select: "CIEL" },
        relationship: "Same as",
        concept: { search: "1940", select: "1940- Oral suspension" }
      }
    ]
  };

  return [
    concept,
    `/${ownerType}/${owner}/sources/${shortCode}/concepts/${id}/`
  ];
}

export function searchAndSelect(
  rowSelector: string,
  placeholderText: string,
  item: { search: string; select: string }
) {
  cy.get(rowSelector)
    .findByText(placeholderText)
    .type(item.search);
  cy.findByTestId("asyncSelectResultsList")
    .findByText(item.select)
    .should("be.visible")
    .click();
}

export function fillNameRow(index: number, concept: TestConcept) {
  cy.findByTestId(`names_${index}_name`).type(concept.names[index].name);
  cy.selectBySelector(
    `[data-testid="names_${index}_name_type"]`,
    concept.names[index].type
  );
  cy.selectBySelector(
    `[data-testid="names_${index}_locale"]`,
    concept.names[index].language
  );
  cy.selectBySelector(
    `[data-testid="names_${index}_locale_preferred"]`,
    concept.names[index].preferredInLanguage
  );
}

export function fillDescriptionRow(index: number, concept: TestConcept) {
  cy.get(`[data-testid="descriptions_${index}_description"]`).type(
    concept.descriptions[index].description
  );
  cy.selectBySelector(
    `[data-testid="descriptions_${index}_locale"]`,
    concept.descriptions[index].language
  );
  cy.selectBySelector(
    `[data-testid="descriptions_${index}_locale_preferred"]`,
    concept.descriptions[index].preferredInLanguage
  );
}

export function fillMappingRow(
  index: number,
  concept: TestConcept,
  type: "answers" | "sets" | "mappings"
) {
  searchAndSelect(
    `[data-testrowid="${type}_${index}"]`,
    "Select a source",
    concept[type][index].source
  );
  // @ts-ignore
  if (concept[type][index].relationship)
    cy.selectBySelector(
      `[data-testid="${type}_${index}_map_type"]`,
      concept[type][index].relationship
    );
  searchAndSelect(
    `[data-testrowid="${type}_${index}"]`,
    "Select a concept",
    concept[type][index].concept
  );
}

export function createConcept(
  dictionaryUrl: string,
  conceptAndUrl: [TestConcept, string]
): [TestConcept, string] {
  const [concept, conceptUrl] = conceptAndUrl;

  cy.visit(dictionaryUrl);

  cy.findByText("View Concepts").click();
  cy.findByTitle("Add concepts").click();
  cy.findByText("Create custom concept").click();
  cy.findByText("Other kind").click();

  cy.findByLabelText("OCL ID").type(concept.id);
  cy.selectByLabelText("Class", concept.class);
  cy.selectByLabelText("Datatype", concept.datatype);

  fillNameRow(0, concept);
  cy.findByText("Add Name").click();
  fillNameRow(1, concept);

  cy.findByText("Add Description").click();
  fillDescriptionRow(0, concept);
  cy.findByText("Add Description").click();
  fillDescriptionRow(1, concept);

  cy.findByText("Add Answer").click();
  fillMappingRow(0, concept, "answers");
  cy.findByText("Add Answer").click();
  fillMappingRow(1, concept, "answers");

  cy.findByText("Add Set Members").click();
  fillMappingRow(0, concept, "sets");

  cy.findByText("Add Mapping").click();
  fillMappingRow(0, concept, "mappings");

  cy.findByText("Submit").click();

  cy.findByTitle("Edit this concept");

  return [concept, conceptUrl];
}
