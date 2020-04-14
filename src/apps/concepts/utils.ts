import { APIOrg, APIProfile } from '../authentication'
import { USER_TYPE } from '../../utils'
// @ts-ignore
import { getParams } from 'url-matcher'

export function getSourceIdFromUrl(sourceUrl?: string) {
  // /orgs/FOO/sources/FOO/ => FOO
  // / => Public Sources

  if (!sourceUrl) return undefined;
  const withoutTrailingSlash = sourceUrl.endsWith("/")
    ? sourceUrl.substring(0, sourceUrl.lastIndexOf("/"))
    : sourceUrl;
  const sourceName =  withoutTrailingSlash.substring(
    withoutTrailingSlash.lastIndexOf("/") + 1
  );

  return sourceName ? sourceName : "Public Sources";
}

export function canModifyConcept(
  conceptUrl: string,
  profile?: APIProfile,
  usersOrgs: APIOrg[] = []
) {
  const CONCEPT_PATTERN =
    "/:ownerType/:owner/(collections/:collectionId)(sources/:sourceId)/concepts/:conceptId/";

  const matches = getParams(CONCEPT_PATTERN, conceptUrl);
  if (!matches) return false;

  if (matches.ownerType === USER_TYPE)
    return profile?.username === matches.owner;
  else return usersOrgs.map(org => org.id).includes(matches.owner);
}
