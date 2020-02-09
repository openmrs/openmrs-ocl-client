const buildAddConceptToDictionaryMessage = (
  results: { expression: string; added: boolean }[]
) => {
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
      ? ` ${alreadyInDictionaryCount} already added concept${wasOrWere(
          alreadyInDictionaryCount
        )} skipped`
      : "";

  return addedConceptsMessage + alreadyAddedMessage;
};

export { buildAddConceptToDictionaryMessage };
