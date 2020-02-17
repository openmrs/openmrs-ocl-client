import {
  AppState,
  completeAction,
  createActionThunk,
  indexedAction,
  progressAction,
  resetAction,
  startAction
} from '../../../redux'
import api from '../api'
import { APIConcept, Concept, Mapping } from '../types'
import {
  addConceptsToDictionaryAction as addConceptsToDictionary,
  removeReferencesFromDictionaryAction as removeReferencesFromDictionary
} from '../../dictionaries'
import {
  RETRIEVE_CONCEPT_ACTION,
  RETRIEVE_CONCEPTS_ACTION,
  UPSERT_CONCEPT_ACTION,
  UPSERT_CONCEPT_AND_MAPPINGS,
  UPSERT_MAPPING_ACTION
} from './actionTypes'
import { ANSWERS_BATCH_INDEX, MAPPINGS_BATCH_INDEX, SETS_BATCH_INDEX } from './constants'

export const retrieveConceptAction = createActionThunk(
  RETRIEVE_CONCEPT_ACTION,
  api.concept.retrieve
);
export const upsertConceptAndMappingsAction = (
  data: Concept,
  sourceUrl: string,
  linkedDictionary?: string
) => {
  return async (dispatch: Function, getState: Function) => {
    dispatch(startAction(indexedAction(UPSERT_CONCEPT_AND_MAPPINGS)));

    const { answers, sets, mappings, ...concept } = data;

    const updating: boolean = !!concept.url;

    let response: APIConcept | boolean;

    dispatch(
      progressAction(
        indexedAction(UPSERT_CONCEPT_AND_MAPPINGS),
        `${updating ? "Updating" : "Creating"} concept...`
      )
    );
    const [action, url] = concept.url
      ? [
          createActionThunk(UPSERT_CONCEPT_ACTION, api.concept.update),
          concept.url
        ]
      : [
          createActionThunk(UPSERT_CONCEPT_ACTION, api.concepts.create),
          sourceUrl
        ];
    response = await dispatch(action<APIConcept>(url, concept));

    if (response === false) {
      // I think that at this point, it is generally sane not to try dealing with the mappings if the concept can't be updated. todo could improve.
      dispatch(
        progressAction(
          indexedAction(UPSERT_CONCEPT_AND_MAPPINGS),
          `Couldn't ${updating ? "update" : "create"} concept`
        )
      );
      dispatch(completeAction(indexedAction(UPSERT_CONCEPT_AND_MAPPINGS)));
      return false;
    }

    const conceptResponse: APIConcept = response as APIConcept;

    await dispatch(resetAction(UPSERT_MAPPING_ACTION));

    const upsertMappings = async (
      rawMappings: Mapping[],
      batchIndex: number,
      message: string
    ) => {
      if (rawMappings.length)
        dispatch(
          progressAction(
            indexedAction(UPSERT_CONCEPT_AND_MAPPINGS),
            `${updating ? "Updating" : "Creating"} ${message}...`
          )
        );

      const mappings = rawMappings.map(mapping => {
        const {
          to_source_url,
          to_concept_code,
          to_concept_url,
          external_id,
          map_type,
          to_concept_name,
          retired,
          url
        } = mapping;
        const common = { external_id, map_type, to_concept_name, retired, url };
        return to_concept_url
          ? {
              ...common,
              from_concept_url: conceptResponse.url,
              to_concept_url
            }
          : {
              ...common,
              from_concept_url: conceptResponse.url,
              to_source_url,
              to_concept_code
            };
      });

      const actions: [
        Mapping,
        CallableFunction,
        string
      ][] = mappings.map((mapping, index) => [
        mapping,
        createActionThunk(
          indexedAction(UPSERT_MAPPING_ACTION, Number(`${batchIndex}${index}`)),
          mapping.url ? api.mapping.update : api.mappings.create
        ),
        mapping.url ? mapping.url : sourceUrl
      ]);

      for (const [mapping, action, url] of actions) {
        // See point below about race condition. We want to stop immediately any of these fails
        const response = await dispatch(action(url, mapping));
        if (response === false) return false;
      }

      return true;
    };

    // I know you're thinking, oh, we could have done these in parallel
    // I see your in-parallel and raise you my race-condition
    // If a user duplicates a mapping say in answers and sets, we want to be able to sequentially point this out
    // todo some more robust error handling
    const mappingsToProcess: [Mapping[], number, string][] = [
      [answers, ANSWERS_BATCH_INDEX, "answers"],
      [sets, SETS_BATCH_INDEX, "sets"],
      [mappings, MAPPINGS_BATCH_INDEX, "mappings"]
    ];
    for (const [values, batchIndex, message] of mappingsToProcess) {
      const response = await upsertMappings(values, batchIndex, message);
      if (response === false) break;
    }

    if (linkedDictionary) {
      dispatch(
        progressAction(
          indexedAction(UPSERT_CONCEPT_AND_MAPPINGS),
          "Updating concept in dictionary..."
        )
      );

      const state: AppState = getState();
      const toConceptUrls: string[] = [
        ...state.concepts.mappings.map(mapping => mapping.to_concept_url)
      ].filter(reference => reference) as string[];

      try {
        // ideally, this block should be atomic
        if (updating) {
          let referencesToRemove = [
            // we don't remove the toConceptUrls because we can't be sure no other mapping depends on them
            // that would break the OCL module importer
            // ...state.concepts.mappings.map(mapping => mapping.url), todo ensure the cascade is working and delete this if so
            concept.version_url
          ].filter(reference => reference) as string[];
          await dispatch(
            removeReferencesFromDictionary(linkedDictionary, referencesToRemove)
          );
        }

        await Promise.all([
          dispatch(
            addConceptsToDictionary(linkedDictionary, [conceptResponse.url])
          ),
          dispatch(
            addConceptsToDictionary(linkedDictionary, toConceptUrls, "none")
          )
        ]);
      } catch (e) {
        // whatever happens, make sure we never loose access to the reference from the dictionary
        // even if it means keeping the old version in
        await dispatch(
          addConceptsToDictionary(linkedDictionary, [
            conceptResponse.url || (concept.url as string)
          ])
        );
      }
    }

    dispatch(progressAction(indexedAction(UPSERT_CONCEPT_AND_MAPPINGS), ""));
    dispatch(completeAction(indexedAction(UPSERT_CONCEPT_AND_MAPPINGS)));
  };
};
export const retrieveConceptsAction = createActionThunk(
  RETRIEVE_CONCEPTS_ACTION,
  api.concepts.retrieve
);
