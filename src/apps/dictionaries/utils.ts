export const buildAddConceptToDictionaryMessage = (
  results: { expression: string; added: boolean }[]
) => {
    if(!Array.isArray(results)) {
      return "";
    }

  const conceptResults = results.filter(result =>
    result.expression.includes("/concepts/")
  );

  const addedCount = conceptResults.filter(result => result.added).length;
  const alreadyInDictionaryCount = conceptResults.length - addedCount;

  const wasOrWere = (length: number) => (length > 1 ? "s were" : " was");

  const addedConceptsMessage =
    addedCount > 0
      ? ` ${addedCount} concept${wasOrWere(addedCount)} added.`
      : "";
  const alreadyAddedMessage =
    alreadyInDictionaryCount > 0
      ? ` ${alreadyInDictionaryCount} concept${wasOrWere(
          alreadyInDictionaryCount
        )} skipped`
      : "";

  return addedConceptsMessage + alreadyAddedMessage;
};

export const dictionaryNameFromUrl = (url: string): string => {
  let words = url.split("/");
  return words[words.length - 2];
};

export const getDictionaryTypeFromPreviousPath = (previousPath: String) => {
  switch (previousPath) {
      case '/collections/':
          return 'Public Dictionaries';
      case '/user/collections/':
          return 'Your Dictionaries';
      case '/user/orgs/collections/' :
          return "Your Organisations' Dictionaries";
      default:
          return 'Dictionaries'
  }
};

