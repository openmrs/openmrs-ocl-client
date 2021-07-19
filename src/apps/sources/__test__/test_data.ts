import { AppState, StatusState } from "../../../redux";
import { APISource, SourceState } from "../types";
import { AuthState } from "../../authentication";
import { DictionaryState } from "../../dictionaries";
import { ConceptsState } from "../../concepts";
import { APIOrganisation, OrganisationState } from "../../organisations";

export const testSource: APISource = {
  id: "MSF-SOURCE",
  short_code: "MSF-SRC",
  name: "MSF Source",
  full_name: "MSF Source",
  source_type: "Dictionary",
  public_access: "View",
  default_locale: "en",
  website: "http://msf.org/",
  description:
    "A universal code system for identifying laboratory and clinical observations.",
  extras: { msf_extra_field: "msf_extra_value" },
  url: "/users/root/sources/MSF-SRC/",
  owner: "root",
  owner_type: "User",
  owner_url: "/users/root/",
  external_id: "123",
  supported_locales: ["en", "fr"],
  custom_validation_schema: "Dictionary",
  active_concepts: 2,
  concepts_url: ""
};

export const personalSources: SourceState = {
  sources: [{ items: [testSource], responseMeta: { key: false } }],
  versions: [],
  showOnlyVerified: false
};

export const orgSources: SourceState = {
  sources: [
    { items: [] },
    { items: [testSource], responseMeta: { key: false } }
  ],
  versions: [],
  showOnlyVerified: false
};

export const publicSources: SourceState = {
  sources: [
    { items: [] },
    { items: [] },
    { items: [testSource], responseMeta: { key: false } }
  ],
  versions: [],
  showOnlyVerified: false
};

export const organisationState: OrganisationState = {
  organisation: {} as APIOrganisation,
  organisations: [],
  showAddMemberDialog: false,
  showDeleteMemberDialog: false,
  showOnlyVerified: false
};

const authState: AuthState = { isLoggedIn: true };

const statusState: StatusState = { key: [] };

const dictionariesState: DictionaryState = {
  dictionaries: [{ items: [] }],
  versions: [],
  addReferencesResults: [],
  showOnlyVerified: true
};

const conceptState: ConceptsState = {
  concepts: { items: [], responseMeta: { num_found: 4 } },
  activeConcepts: { items: [], responseMeta: { num_found: 3 } },
  mappings: []
};

export const currentState = (sources: SourceState) => {
  const currentState: AppState = {
    auth: authState,
    status: statusState,
    dictionaries: dictionariesState,
    concepts: conceptState,
    sources: sources,
    organisations: organisationState
  };

  return currentState;
};
