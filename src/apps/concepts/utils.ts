export function getSourceIdFromUrl (sourceUrl?: string) {
  // /orgs/CIEL/sources/CIEL/ => CIEL
  if (!sourceUrl) return undefined;
  const withoutTrailingSlash = sourceUrl.endsWith('/') ? sourceUrl.substring(0, sourceUrl.lastIndexOf('/')) : sourceUrl;
  return withoutTrailingSlash.substring(withoutTrailingSlash.lastIndexOf('/') + 1);
}
