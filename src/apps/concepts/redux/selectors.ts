import {
  AppState,
  errorListSelector,
  loadingSelector,
  progressSelector
} from "../../../redux";
import {
  RETRIEVE_ACTIVE_CONCEPTS_ACTION,
  RETRIEVE_CONCEPT_ACTION,
  RETRIEVE_CONCEPTS_ACTION,
  UPSERT_CONCEPT_ACTION,
  UPSERT_CONCEPT_AND_MAPPINGS,
  UPSERT_MAPPING_ACTION
} from "./actionTypes";
import { errorSelector } from "../../../redux/selectors";
import { removeReferencesFromDictionaryLoadingSelector } from "../../dictionaries/redux";

export const upsertConceptAndMappingsLoadingSelector = loadingSelector(
  UPSERT_CONCEPT_AND_MAPPINGS
);
export const upsertConceptAndMappingsProgressSelector = progressSelector(
  UPSERT_CONCEPT_AND_MAPPINGS
);
export const upsertConceptErrorsSelector = errorSelector(UPSERT_CONCEPT_ACTION);
export const viewConceptLoadingSelector = loadingSelector(
  RETRIEVE_CONCEPT_ACTION
);
export const viewConceptErrorsSelector = errorSelector(RETRIEVE_CONCEPT_ACTION);
export const viewConceptsLoadingSelector = loadingSelector(
  RETRIEVE_CONCEPTS_ACTION
);
export const viewConceptsErrorsSelector = errorSelector(
  RETRIEVE_CONCEPTS_ACTION
);
export const viewActiveConceptsLoadingSelector = loadingSelector(
    RETRIEVE_ACTIVE_CONCEPTS_ACTION
);
export const viewActiveConceptsErrorsSelector = errorSelector(
    RETRIEVE_ACTIVE_CONCEPTS_ACTION
);
export const upsertAllMappingsErrorSelector = errorListSelector(
  UPSERT_MAPPING_ACTION
);
export function removeConceptsFromDictionaryLoadingSelector(state: AppState) {
  const removeReferencesStatus = removeReferencesFromDictionaryLoadingSelector(
    state
  );
  if (!removeReferencesStatus) return false;

  return (removeReferencesStatus as boolean[]).includes(true);
}
