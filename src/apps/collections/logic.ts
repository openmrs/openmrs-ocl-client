import api from './api'
import { APIMapping, InternalAPIMapping } from '../concepts'
import { union } from 'lodash'

const fetchCIELMappings = async (fromConcepts: string[]): Promise<APIMapping[]> => {
  try {
    return (await api.retrieveCIELMappings(fromConcepts)).data
  } catch (e) {
    return []
  }
}

export const recursivelyFetchToConcepts = async (
  fromConcepts: string[],
  levelsToCheck: number = 20,
  fetchMappings = fetchCIELMappings,
  updateNotification: (message: string) => {},
): Promise<string[]> => {
  const getConceptUrls = (mappingsLists: InternalAPIMapping[][]): string[] => {
    const toConceptUrls = union(...mappingsLists).map(mapping => mapping.to_concept_url)
    return toConceptUrls.filter(toConceptUrl => !!toConceptUrl)
  }

  // @ts-ignore
  const removeExternalMappings = (mappingsList: APIMapping[]): InternalAPIMapping[] => mappingsList.filter(
    mapping => mapping.to_concept_url,
  )

  updateNotification('Finding dependent concepts...')
  const startingConceptMappings: APIMapping[] = await fetchMappings(fromConcepts)
  const mappingsLists = [removeExternalMappings(startingConceptMappings)]
  updateNotification(`Found ${getConceptUrls(mappingsLists).length} dependent concepts to add...`)

  for (let i = 0; i < levelsToCheck; i += 1) {
    const toConceptCodes = mappingsLists[i].map(
      mapping => mapping.to_concept_code,
    )
    if (!toConceptCodes.length) break
    const conceptMappings = await fetchMappings(toConceptCodes)
    mappingsLists.push(removeExternalMappings(conceptMappings))
    updateNotification(`Found ${getConceptUrls(mappingsLists).length} dependent concepts to add...`)
  }

  return getConceptUrls(mappingsLists)
}
