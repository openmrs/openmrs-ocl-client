import {
  AppState,
  completeAction,
  createActionThunk,
  indexedAction,
  progressAction,
  resetAction,
  startAction
} from "../../../redux";
import api from "../api";
import dictionaryApi from "../../dictionaries/api";
import { APIConcept, apiConceptToConcept, Concept, Mapping } from "../types";
import {
  addConceptsToDictionaryAction as addConceptsToDictionary,
  APIDictionary,
  recursivelyAddConceptsToDictionaryAction,
  removeReferencesFromDictionaryAction as removeReferencesFromDictionary
} from "../../dictionaries";
import {
  RETRIEVE_CONCEPT_ACTION,
  RETRIEVE_CONCEPTS_ACTION,
  RETRIEVE_ACTIVE_CONCEPTS_ACTION,
  UPSERT_CONCEPT_ACTION,
  UPSERT_CONCEPT_AND_MAPPINGS,
  UPSERT_MAPPING_ACTION,
  CLONE_CONCEPT_ACTION
} from "./actionTypes";
import {
  ANSWERS_BATCH_INDEX,
  MAPPINGS_BATCH_INDEX,
  SETS_BATCH_INDEX
} from "./constants";
import { debug, STATUS_CODES_TO_MESSAGES } from "../../../utils";
import axios, { AxiosResponse } from "axios";
import { errorMsgResponse, FAILURE } from "../../../redux/utils";
import { v4 as uuid } from "uuid";
import { pick } from "lodash";
import { populatedMappingToMapping } from "../utils";

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
    dispatch(startAction(UPSERT_CONCEPT_AND_MAPPINGS));

    const { answers, sets, mappings, ...concept } = data;

    const updating: boolean = !!concept.url;

    let response: APIConcept | boolean;

    function finish() {
      dispatch(progressAction(UPSERT_CONCEPT_AND_MAPPINGS, ""));
      dispatch(completeAction(UPSERT_CONCEPT_AND_MAPPINGS));
    }

    dispatch(
      progressAction(
        UPSERT_CONCEPT_AND_MAPPINGS,
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
          UPSERT_CONCEPT_AND_MAPPINGS,
          `Couldn't ${updating ? "update" : "create"} concept`
        )
      );
      dispatch(completeAction(UPSERT_CONCEPT_AND_MAPPINGS));
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
            UPSERT_CONCEPT_AND_MAPPINGS,
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
          url,
          extras
        } = mapping;
        const common = {
          external_id,
          map_type,
          to_concept_name,
          retired,
          url,
          extras
        };
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
      if (updating && response === false) {
        // short circuit this here because we don't want to lose the current concept version
        // and don't really care about the updates the user made if not everything went smoothly
        // I'd previously relied on the fact that collections don't allow you to add multiple versions
        // per concept, but that behaviour seems buggy from the api end and this was simply a further precaution
        // todo handle the same scenario when on the create concept page, involves copying the version_url into the form
        return finish();
      }
    }

    if (linkedDictionary) {
      dispatch(
        progressAction(
          UPSERT_CONCEPT_AND_MAPPINGS,
          "Updating concept in dictionary..."
        )
      );

      const state: AppState = getState();
      // we *only* want to import either concept answers or members of the concept set
      const toConceptUrls: string[] = [
        ...state.concepts.mappings
          .filter(
            mapping =>
              mapping.map_type === "CONCEPT-SET" ||
              mapping.map_type === "Q-AND-A"
          )
          .map(mapping => mapping.to_concept_url)
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

    dispatch(progressAction(UPSERT_CONCEPT_AND_MAPPINGS, ""));
    dispatch(completeAction(UPSERT_CONCEPT_AND_MAPPINGS));
  };
};
export const retrieveConceptsAction = createActionThunk(
  RETRIEVE_CONCEPTS_ACTION,
  api.concepts.retrieve
);
export const retrieveActiveConceptsAction = createActionThunk(
  RETRIEVE_ACTIVE_CONCEPTS_ACTION,
  api.concepts.retrieveActive
);
export const resetConceptFormAction = () => {
  return (dispatch: Function) => {
    dispatch(resetAction(UPSERT_CONCEPT_ACTION));
    dispatch(resetAction(UPSERT_CONCEPT_AND_MAPPINGS));
  };
};

export const cloneConceptToDictionaryAction = (
  dictionaryUrl: string,
  concept: APIConcept
) => {
  return async (dispatch: Function) => {
    dispatch(startAction(CLONE_CONCEPT_ACTION));

    let dictionaryResponse: AxiosResponse<APIDictionary>;
    try {
      dictionaryResponse = await dictionaryApi.dictionaries.retrieve.private(
        dictionaryUrl
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        debug(
          JSON.stringify(error),
          "cloneConceptsToDictionaryAction#fetchDictionary"
        );

        const response = error.response;

        let errorMsg = errorMsgResponse(response);

        const errorMessage: string | undefined | {} | [] =
          response?.data || response
            ? STATUS_CODES_TO_MESSAGES[response.status] || errorMsg
            : errorMsg;

        dispatch({
          type: `${CLONE_CONCEPT_ACTION}_${FAILURE}`,
          payload: errorMessage
        });
      }

      return;
    }

    const sourceUrl = dictionaryResponse.data.extras?.source;

    if (sourceUrl === undefined) {
      const errorMessage = `${dictionaryUrl} does not have a linked source`;
      debug(errorMessage, "cloneConceptsToDictionaryAction");

      dispatch({
        type: `${CLONE_CONCEPT_ACTION}_${FAILURE}`,
        payload: errorMessage
      });

      return;
    }

    const newConcept = pick(
      apiConceptToConcept(concept, concept.mappings),
      "id",
      "external_id",
      "concept_class",
      "datatype",
      "names",
      "descriptions",
      "extras",
      "answers",
      "sets",
      "mappings",
      "retired"
    ) as Concept;

    for (let i = 0; i < newConcept.names.length; i++) {
      newConcept.names[i] = pick(
        newConcept.names[i],
        "name",
        "locale",
        "external_id",
        "locale_preferred",
        "name_type"
      );
    }

    for (let i = 0; i < newConcept.descriptions.length; i++) {
      newConcept.descriptions[i] = pick(
        newConcept.descriptions[i],
        "description",
        "locale",
        "external_id",
        "locale_preferred"
      );
    }

    for (let i = 0; i < newConcept.answers.length; i++) {
      newConcept.answers[i] = populatedMappingToMapping(newConcept.answers[i]);
    }

    for (let i = 0; i < newConcept.sets.length; i++) {
      newConcept.sets[i] = populatedMappingToMapping(newConcept.sets[i]);
    }

    for (let i = 0; i < newConcept.mappings.length; i++) {
      newConcept.mappings[i] = populatedMappingToMapping(
        newConcept.mappings[i]
      );
    }

    console.log(concept, newConcept);
    if (newConcept === undefined) {
      dispatch(completeAction(CLONE_CONCEPT_ACTION));
      return;
    }

    newConcept.mappings.push({
      map_type: "SAME-AS",
      external_id: uuid(),
      from_concept_url: `${sourceUrl}concepts/${newConcept.id}/`,
      to_concept_url: concept.url
    });

    let response = await dispatch(
      upsertConceptAndMappingsAction(newConcept, sourceUrl)
    );

    if (response === false) {
      dispatch({
        type: `${CLONE_CONCEPT_ACTION}_${FAILURE}`,
        payload: "Couldn't create concept"
      });

      dispatch(completeAction(CLONE_CONCEPT_ACTION));
      return;
    }

    let newlyAddedConceptResponse: AxiosResponse<APIConcept>;
    try {
      newlyAddedConceptResponse = await api.concept.retrieve(
        `${sourceUrl}concepts/${encodeURIComponent(newConcept.id)}/`
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        debug(
          JSON.stringify(error),
          "cloneConceptsToDictionaryAction#fetchNewConcept"
        );

        const response = error.response;

        let errorMsg = errorMsgResponse(response);

        const errorMessage: string | undefined | {} | [] =
          response?.data || response
            ? STATUS_CODES_TO_MESSAGES[response.status] || errorMsg
            : errorMsg;

        dispatch({
          type: `${CLONE_CONCEPT_ACTION}_${FAILURE}`,
          payload: errorMessage
        });
      }

      return;
    }

    await dispatch(
      recursivelyAddConceptsToDictionaryAction(dictionaryUrl, [
        newlyAddedConceptResponse.data
      ])
    );

    dispatch(completeAction(CLONE_CONCEPT_ACTION));
  };
};
