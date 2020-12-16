export interface APIOrganisation {
  id: string;
  name: string;
  url: string;

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

export interface OrganisationState {
  organisations?: APIOrganisation[];
  newOrganisation?:{}
}
