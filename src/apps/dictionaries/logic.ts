import api from "./api";
import { APIMapping, InternalAPIMapping } from "../concepts";
import { union } from "lodash";

const fetchConceptMappings = async (
  sourceUrl: string,
  fromConceptIds: string[]
): Promise<APIMapping[]> => {
  try {
    return (await api.retrieveMappings(sourceUrl, fromConceptIds)).data;
  } catch (e) {
    return [];
  }
};

const recursivelyFetchToConcepts = async (
  fromSource: string,
  fromConceptIds: string[],
  updateNotification: (message: string) => void,
  levelsToCheck: number = 20,
  fetchMappings: (
    sourceUrl: string,
    fromConceptIds: string[]
  ) => Promise<APIMapping[]> = fetchConceptMappings
): Promise<string[]> => {
  const getConceptUrls = (mappingsLists: InternalAPIMapping[][]): string[] => {
    const toConceptUrls = union(...mappingsLists).map(
      mapping => mapping.to_concept_url
    );
    return toConceptUrls.filter(toConceptUrl => !!toConceptUrl);
  };

  const removeExternalMappings = (
    mappingsList: APIMapping[]
  ): InternalAPIMapping[] =>
    mappingsList.filter(
      mapping => mapping.to_concept_url
    ) as InternalAPIMapping[];

  updateNotification("Finding dependent concepts...");
  const startingConceptMappings: APIMapping[] = await fetchMappings(
    fromSource,
    fromConceptIds
  );
  const mappingsLists = [removeExternalMappings(startingConceptMappings)];
  updateNotification(
    `Found ${getConceptUrls(mappingsLists).length} dependent concepts to add...`
  );

  const loadedConcepts = new Set();
  for (let i = 0; i < levelsToCheck; i += 1) {
    const toConceptCodes = mappingsLists[i]
      .filter(m => m.map_type === 'Q-AND-A' || m.map_type === 'CONCEPT-SET')
      .map(mapping => mapping.to_concept_code)
      .filter(code => !loadedConcepts.has(code));

    if (!toConceptCodes.length) {
      break;
    }

    toConceptCodes.forEach(code => loadedConcepts.add(code));

    const conceptMappings = await fetchMappings(fromSource, toConceptCodes);
    mappingsLists.push(removeExternalMappings(conceptMappings));
    updateNotification(
      `Found ${
        getConceptUrls(mappingsLists).length
      } dependent concepts to add...`
    );
  }

  return getConceptUrls(mappingsLists);
};

export { recursivelyFetchToConcepts };
