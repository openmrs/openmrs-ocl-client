import React, { useEffect, useState } from "react";
import { includes } from "lodash";
import { createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import { ConceptsTable, AddConceptsIcon } from "../components";
import { connect } from "react-redux";
import {
  removeConceptsFromDictionaryLoadingSelector,
  retrieveConceptsAction,
  viewConceptsLoadingSelector,
  viewConceptsErrorsSelector
} from "../redux";
import { AppState } from "../../../redux";
import { APIConcept, OptionalQueryParams as QueryParams } from "../types";
import { useHistory, useLocation, useParams } from "react-router";
import { useQueryParams } from "../../../utils";
import qs from "qs";
import { ProgressOverlay } from "../../../utils/components";
import FilterOptions from "../components/FilterOptions";
import {
  APIOrg,
  APIProfile,
  canModifyContainer,
  profileSelector
} from "../../authentication";
import { orgsSelector } from "../../authentication/redux/reducer";
import {
  DICTIONARY_CONTAINER,
  FILTER_SOURCE_IDS,
  SOURCE_CONTAINER,
  SOURCE_VERSION_CONTAINER
} from "../constants";
import {
  dictionarySelector,
  recursivelyAddConceptsToDictionaryAction,
  removeReferencesFromDictionaryAction,
  makeRetrieveDictionaryAction,
  retrieveDictionaryLoadingSelector
} from "../../dictionaries/redux";
import { canModifyConcept, getContainerIdFromUrl } from "../utils";
import { APIDictionary } from "../../dictionaries";
import {
  sourceSelector,
  retrieveSourceLoadingSelector,
  retrieveSourceAndDetailsAction,
  retrievePublicSourcesAction
} from "../../sources/redux";
import { APISource } from "../../sources";
import ViewConceptsHeader from "../components/ViewConceptsHeader";
import { PUBLIC_SOURCES_ACTION_INDEX } from "../../sources/redux/constants";

export interface StateProps {
  concepts?: APIConcept[];
  modifiedConcepts?: APIConcept[];
  dictionary?: APIDictionary;
  source?: APISource;
  sources: APISource[];
  loading: boolean;
  errors?: {};
  meta?: { num_found?: number };
  profile?: APIProfile;
  usersOrgs?: APIOrg[];
}

export type ActionProps = {
  retrieveConcepts: (
    ...args: Parameters<typeof retrieveConceptsAction>
  ) => void;
  retrieveDictionary: (
    ...args: Parameters<ReturnType<typeof makeRetrieveDictionaryAction>>
  ) => void;
  addConceptsToDictionary: (
    ...args: Parameters<typeof recursivelyAddConceptsToDictionaryAction>
  ) => void;
  removeConceptsFromDictionary: (
    ...args: Parameters<typeof removeReferencesFromDictionaryAction>
  ) => void;
  retrieveSource: (
    ...args: Parameters<typeof retrieveSourceAndDetailsAction>
  ) => void;
  retrievePublicSources: (
    ...args: Parameters<typeof retrievePublicSourcesAction>
  ) => void;
};

export interface OwnProps {
  containerType: string;
  viewDictConcepts?: boolean;
}

type Props = StateProps & ActionProps & OwnProps;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      textDecoration: "none",
      color: "inherit",
      width: "100%"
    },
    largerTooltip: {
      fontSize: "larger"
    },
    content: {
      height: "100%"
    }
  })
);

const INITIAL_LIMIT = 10; // todo get limit from settings

const ViewConceptsPage: React.FC<Props> = ({
  concepts,
  modifiedConcepts,
  dictionary,
  source,
  retrievePublicSources,
  sources = [],
  loading,
  errors,
  retrieveConcepts,
  retrieveDictionary,
  retrieveSource,
  meta = {},
  profile,
  usersOrgs,
  containerType,
  viewDictConcepts,
  addConceptsToDictionary,
  removeConceptsFromDictionary
}) => {
  const classes = useStyles();

  const { replace: goTo } = useHistory(); // replace because we want to keep the back button useful
  const { pathname: url } = useLocation();
  const containerUrl = url.replace("/concepts", "");
  const { ownerType, owner } = useParams<{
    ownerType: string;
    owner: string;
  }>();

  // only relevant with the collection container
  const preferredSource = dictionary?.preferred_source || "Public Sources";
  const linkedSource =
    containerType === SOURCE_CONTAINER ||
    containerType === SOURCE_VERSION_CONTAINER
      ? source?.url
      : dictionary?.extras?.source;
  // end only relevant with the collection container

  const queryParams: QueryParams = useQueryParams();
  const {
    page = 1,
    sortDirection = "sortDesc",
    sortBy = "_score",
    limit = INITIAL_LIMIT,
    q: initialQ = "",
    classFilters: initialClassFilters = [],
    dataTypeFilters: initialDataTypeFilters = [],
    generalFilters: initialGeneralFilters = [],
    sourceFilters: initialSourceFilters = [],
    addToDictionary: dictionaryToAddTo
  } = queryParams;

  const sourceUrl = "/sources/";
  const sourcesLimit = 0;
  useEffect(() => {
    retrievePublicSources(sourceUrl, initialQ, sourcesLimit, page);
  }, [initialQ, page, retrievePublicSources]);
  // This useEffect is to fetch the dictionary while on the concepts page,
  // before when one would refresh the page the would lose the dictionary.
  useEffect(() => {
    if (dictionary === undefined && dictionaryToAddTo) {
      retrieveDictionary(dictionaryToAddTo);
    }
  }, [dictionary, dictionaryToAddTo]); // eslint-disable-line react-hooks/exhaustive-deps

  const [showOptions, setShowOptions] = useState(true);
  // why did he put the filtered state here and not inside the component, you ask?
  // consistency my friend, consistency. The key thing here is one can trigger a requery by changing
  // the page count/ number and if the state is not up here then, we query with stale options
  const [classFilters, setClassFilters] = useState<string[]>(
    initialClassFilters
  );
  const [dataTypeFilters, setInitialDataTypeFilters] = useState<string[]>(
    initialDataTypeFilters
  );
  const [generalFilters, setGeneralFilters] = useState<string[]>(
    initialGeneralFilters
  );
  const [sourceFilters, setSourceFilters] = useState<string[]>(
    initialSourceFilters
  );

  const excludeAddedConceptsUrl = `${url}?collection=!${dictionary?.name}&collectionOwnerUrl=!${dictionary?.owner_url}`;
  const includeAddedConcepts = generalFilters.includes(
    "Include Added Concepts"
  );
  const isImporting = dictionaryToAddTo !== undefined;

  const [q, setQ] = useState(initialQ);

  const gimmeAUrl = (params: QueryParams = {}, conceptsUrl: string = url) => {
    const newParams: QueryParams = {
      ...queryParams,
      ...{
        classFilters: classFilters,
        dataTypeFilters: dataTypeFilters,
        generalFilters: generalFilters,
        sourceFilters: sourceFilters,
        page: 1,
        q
      },
      ...params
    };
    return `${conceptsUrl}?${qs.stringify(newParams)}`;
  };

  useEffect(() => {
    // we don't make this reactive(only depend on the initial values), because the requirement
    // was only trigger queries on user search(enter or apply filters, or change page)
    containerType === SOURCE_CONTAINER ||
    containerType === SOURCE_VERSION_CONTAINER
      ? retrieveSource(containerUrl)
      : retrieveDictionary(containerUrl);

    retrieveConcepts({
      conceptsUrl: isImporting
        ? includeAddedConcepts
          ? url
          : excludeAddedConceptsUrl
        : url,
      page: page,
      limit: limit,
      q: initialQ,
      sortDirection: sortDirection,
      sortBy: sortBy,
      dataTypeFilters: initialDataTypeFilters,
      classFilters: initialClassFilters,
      sourceFilters: initialSourceFilters,
      includeRetired: initialGeneralFilters.includes("Include Retired"),
      includeAdded: generalFilters.includes("Include Added Concepts")
    });
    // i don't know how the comparison algorithm works, but for these arrays, it fails.
    // stringify the arrays to work around that
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    retrieveConcepts,
    url,
    page,
    limit,
    initialQ,
    sortDirection,
    sortBy,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    initialDataTypeFilters.toString(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    initialClassFilters.toString(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    initialSourceFilters.toString(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    initialGeneralFilters.toString()
  ]);

  const canModifyDictionary =
    containerType === DICTIONARY_CONTAINER &&
    canModifyContainer(ownerType, owner, profile, usersOrgs);

  const canModifySource =
    containerType === SOURCE_CONTAINER &&
    canModifyContainer(ownerType, owner, profile, usersOrgs) &&
    !dictionaryToAddTo;

  return (
    <ViewConceptsHeader
      containerType={containerType}
      containerUrl={containerUrl}
      gimmeAUrl={gimmeAUrl}
      addConceptToDictionary={dictionaryToAddTo}
      sources={sources}
    >
      <Grid
        container
        className={classes.content}
        component="div"
        justify="space-around"
        alignItems="flex-start"
      >
        <ProgressOverlay
          loading={loading}
          error={
            errors
              ? "Could not fetch concepts. Refresh this page to retry"
              : undefined
          }
        >
          <Grid
            id="viewConceptsPage"
            item
            xs={showOptions ? 9 : 12}
            component="div"
          >
            <ConceptsTable
              concepts={(viewDictConcepts ? concepts : modifiedConcepts) ?? []}
              buttons={{
                edit: canModifyDictionary || canModifySource, // relevant for DICTIONARY_CONTAINER, condition already includes isDictionary condition
                addToDictionary:
                  containerType === SOURCE_CONTAINER && !!dictionaryToAddTo // relevant for SOURCE_CONTAINER
              }}
              q={q}
              setQ={setQ}
              page={page}
              sortDirection={sortDirection}
              sortBy={sortBy}
              limit={Number(limit)}
              buildUrl={gimmeAUrl}
              goTo={goTo}
              count={meta.num_found || concepts?.length || 0}
              toggleShowOptions={() => setShowOptions(!showOptions)}
              addConceptsToDictionary={(concepts: APIConcept[]) =>
                dictionaryToAddTo &&
                addConceptsToDictionary(
                  containerUrl,
                  dictionaryToAddTo,
                  concepts
                )
              }
              dictionaryToAddTo={dictionaryToAddTo}
              linkedDictionary={containerUrl}
              linkedSource={linkedSource}
              canModifyConcept={(concept: APIConcept) =>
                canModifyConcept(concept.url, profile, usersOrgs)
              }
              removeConceptsFromDictionary={(conceptVersionUrls: string[]) =>
                removeConceptsFromDictionary(containerUrl, conceptVersionUrls)
              }
            />
          </Grid>
          {!showOptions ? (
            ""
          ) : (
            <Grid item xs={2} component="div">
              <FilterOptions
                checkedClasses={classFilters}
                setCheckedClasses={setClassFilters}
                checkedDataTypes={dataTypeFilters}
                setCheckedDataTypes={setInitialDataTypeFilters}
                checkedGeneral={generalFilters}
                setCheckedGeneral={setGeneralFilters}
                checkedSources={sourceFilters}
                setCheckedSources={setSourceFilters}
                showSources={containerType !== SOURCE_CONTAINER}
                // interesting how we generate these, isn't it? yeah well, this is an important feature, so there :)
                sourceOptions={
                  [
                    getContainerIdFromUrl(linkedSource),
                    ...FILTER_SOURCE_IDS
                  ].filter(source => source !== undefined) as string[]
                }
                url={gimmeAUrl()}
              />
            </Grid>
          )}
        </ProgressOverlay>
      </Grid>

      <AddConceptsIcon
        canModifyDictionary={canModifyDictionary}
        canModifySource={canModifySource}
        containerUrl={containerUrl}
        gimmeAUrl={gimmeAUrl}
        linkedSource={linkedSource}
        preferredSource={preferredSource}
      />
    </ViewConceptsHeader>
  );
};

const mapStateToProps = (state: AppState) => {
  const dictionary = dictionarySelector(state);
  const concepts = state.concepts.concepts.items || [];
  const dictionaryConcepts = dictionary?.references.map(r => r.expression);
  const modifiedConcepts = concepts?.map(c =>
    includes(dictionaryConcepts, c.version_url)
      ? { ...c, added: true }
      : { ...c }
  );
  return {
    profile: profileSelector(state),
    usersOrgs: orgsSelector(state),
    concepts: state.concepts.concepts
      ? state.concepts.concepts.items
      : undefined,
    modifiedConcepts: modifiedConcepts,
    dictionary: dictionarySelector(state),
    source: sourceSelector(state),
    sources: state.sources.sources[PUBLIC_SOURCES_ACTION_INDEX]?.items,
    meta: state.concepts.concepts
      ? state.concepts.concepts.responseMeta
      : undefined,
    loading:
      viewConceptsLoadingSelector(state) ||
      retrieveDictionaryLoadingSelector(state) ||
      removeConceptsFromDictionaryLoadingSelector(state) ||
      retrieveSourceLoadingSelector(state),
    errors: viewConceptsErrorsSelector(state)
  };
};

const mapActionsToProps = {
  retrieveConcepts: retrieveConceptsAction,
  retrieveDictionary: makeRetrieveDictionaryAction(true),
  retrieveSource: retrieveSourceAndDetailsAction,
  addConceptsToDictionary: recursivelyAddConceptsToDictionaryAction,
  removeConceptsFromDictionary: removeReferencesFromDictionaryAction,
  retrievePublicSources: retrievePublicSourcesAction
};

export default connect<StateProps, ActionProps, OwnProps, AppState>(
  mapStateToProps,
  mapActionsToProps
)(ViewConceptsPage);
