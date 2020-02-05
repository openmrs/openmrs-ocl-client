const buildAddConceptToCollectionMessage = (results: {expression: string, added: boolean}[]) => {
  const conceptResults = results.filter(result => result.expression.includes('/concepts/'));

  const addedCount = conceptResults.filter(result => result.added).length;
  const alreadyInCollectionCount = conceptResults.length - addedCount;

  const wasOrWere = (length: number) => length > 1 ? 's were' : ' was';

  const addedConceptsMessage = addedCount > 0 ? ` ${addedCount} concept${wasOrWere(addedCount)} added.` : '';
  const alreadyAddedMessage = alreadyInCollectionCount > 0 ? ` ${alreadyInCollectionCount} already added concept${wasOrWere(alreadyInCollectionCount)} skipped` : '';

  return addedConceptsMessage + alreadyAddedMessage;
};

export { buildAddConceptToCollectionMessage };
