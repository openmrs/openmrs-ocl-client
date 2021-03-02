export interface BaseAPIOrganisation {
  id: string;
  name: string;
  url: string;

}
export interface OrgSource {
  short_code: string;
  name: string;
  url: string;
  owner: string;
  owner_type: string;
  owner_url: string;
}
export interface OrgCollection {
  id: string;
  name: string;
  url: string;
  owner: string;
  owner_type: string;
  owner_url: string;
}
export interface APIOrganisation extends BaseAPIOrganisation {
  type: string;
  uuid: string;
  company: string;
  website: string;
  location: string;
  public_access: string;
  extras: Extras | null;
  members_url: string;
  sources_url: string;
  collections_url: string
  members: number,
  public_collections: number,
  public_sources: number,
  created_on: string,
  created_by: string,
  updated_on: string,
  updated_by: string;
}
export interface Extras {
  source?: string
}

export interface Organisation {
  id: string;
  name: string;
  company?: string;
  website?: string;
  location?: string;
  extras?: Extras | null;
  public_access?: string;
}

export interface EditableOrganisationFields {
  name: string;
  company?: string;
  website?: string;
  location?: string;
  extras?: Extras | null;
  public_access?: string;
}
export interface OrganisationState {
  organisation: APIOrganisation
  organisations: { items: APIOrganisation[]; responseMeta?: any }[]
  meta?: any
  newOrganisation?: APIOrganisation
  editedOrganisation?: APIOrganisation
  orgSources?: OrgSource[]
  orgCollections?: OrgCollection[]
  orgMembers?: OrgMember[]
}
export interface OrgMember{
  username: string;
  name?: string;
  url?: string;
}

export const apiOrgToOrganisation = (
  apiOrganisation?: APIOrganisation
): APIOrganisation | undefined => {
  if (!apiOrganisation) return apiOrganisation;
};