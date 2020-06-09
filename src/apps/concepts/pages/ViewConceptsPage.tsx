import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import {
  Button,
  createStyles,
  Fab,
  Grid,
  makeStyles,
  Menu,
  MenuItem,
  Theme,
  Tooltip
} from "@material-ui/core";
import { ConceptsTable } from "../components";
import { connect } from "react-redux";
import {
  removeConceptsFromDictionaryLoadingSelector,
  retrieveConceptsAction,
  viewConceptsErrorsSelector,
  viewConceptsLoadingSelector
} from "../redux";
import { AppState } from "../../../redux";
import { APIConcept, OptionalQueryParams as QueryParams } from "../types";
import { useHistory, useLocation, useParams } from "react-router";
import {
  CONCEPT_CLASSES,
  PREFERRED_SOURCES_VIEW_ONLY,
  useAnchor,
  useQueryParams
} from "../../../utils";
import qs from "qs";
import { ProgressOverlay } from "../../../utils/components";
import FilterOptions from "../components/FilterOptions";
import { Add as AddIcon } from "@material-ui/icons";
import { Link } from "react-router-dom";
import {
  APIOrg,
  APIProfile,
  canModifyContainer,
  profileSelector
} from "../../authentication";
import { orgsSelector } from "../../authentication/redux/reducer";
import {
  DICTIONARY_CONTAINER,
  DICTIONARY_VERSION_CONTAINER,
  FILTER_SOURCE_IDS,
  SOURCE_CONTAINER
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

interface StateProps {
  concepts?: APIConcept[];
  dictionary?: APIDictionary;
  loading: boolean;
  errors?: {};
  meta?: { num_found?: number };
  profile?: APIProfile;
  usersOrgs?: APIOrg[];
}

type ActionProps = {
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
};

interface OwnProps {
  containerType: string;
}

type Props = StateProps & ActionProps & OwnProps;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      textDecoration: "none",
      color: "inherit",
      width: "100%"
    },
    lightColour: {
      color: theme.palette.background.default
    }
  })
);

const INITIAL_LIMIT = 10; // todo get limit from settings

const ViewConceptsPage: React.FC<Props> = ({
  concepts,
  dictionary,
  loading,
  errors,
  retrieveConcepts,
  retrieveDictionary,
  meta = {},
  profile,
  usersOrgs,
  containerType,
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
  const linkedSource = dictionary?.extras?.source;
  // end only relevant with the collection container

  const [addNewAnchor, handleAddNewClick, handleAddNewClose] = useAnchor();
  const [customAnchor, handleCustomClick, handleCustomClose] = useAnchor();
  const [
    importExistingAnchor,
    handleImportExistingClick,
    handleImportExistingClose
  ] = useAnchor();
  const [
    switchSourceAnchor,
    handleSwitchSourceClick,
    handleSwitchSourceClose
  ] = useAnchor();

  const queryParams: QueryParams = useQueryParams();
  const {
    page = 1,
    sortDirection = "sortAsc",
    sortBy = "id",
    limit = INITIAL_LIMIT,
    q: initialQ = "",
    classFilters: initialClassFilters = [],
    dataTypeFilters: initialDataTypeFilters = [],
    sourceFilters: initialSourceFilters = [],
    addToDictionary: dictionaryToAddTo
  } = queryParams;

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
  const [sourceFilters, setSourceFilters] = useState<string[]>(
    initialSourceFilters
  );
  const [q, setQ] = useState(initialQ);

  const gimmeAUrl = (params: QueryParams = {}, conceptsUrl: string = url) => {
    const newParams: QueryParams = {
      ...queryParams,
      ...{
        classFilters: classFilters,
        dataTypeFilters: dataTypeFilters,
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
    retrieveDictionary(containerUrl);
    retrieveConcepts(
      url,
      page,
      limit,
      initialQ,
      sortDirection,
      sortBy,
      initialDataTypeFilters,
      initialClassFilters,
      initialSourceFilters,
      true
    );
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
    initialSourceFilters.toString()
  ]);

  const canModifyDictionary =
    containerType === DICTIONARY_CONTAINER &&
    canModifyContainer(ownerType, owner, profile, usersOrgs);

  const showHeaderComponent = containerType === SOURCE_CONTAINER;

  return (
    <>
      <Header
        title={
          containerType === SOURCE_CONTAINER
            ? `Import existing concept from ${getContainerIdFromUrl(
                containerUrl
              )}`
            : `Concepts in ${
                containerType === DICTIONARY_VERSION_CONTAINER ? "v" : ""
              }${getContainerIdFromUrl(containerUrl)}`
        }
        justifyChildren="space-around"
        headerComponent={
          !showHeaderComponent ? null : (
            <>
              <Button
                className={classes.lightColour}
                variant="text"
                size="large"
                aria-haspopup="true"
                onClick={handleSwitchSourceClick}
              >
                Switch source (Currently {getContainerIdFromUrl(containerUrl)})
              </Button>
              <Menu
                anchorEl={switchSourceAnchor}
                keepMounted
                open={Boolean(switchSourceAnchor)}
                onClose={handleSwitchSourceClose}
              >
                {Object.entries(PREFERRED_SOURCES_VIEW_ONLY).map(
                  ([preferredSourceName, preferredSourceUrl]) => (
                    <MenuItem
                      // replace because we want to keep the back button useful
                      replace
                      to={gimmeAUrl({}, `${preferredSourceUrl}concepts/`)}
                      component={Link}
                      onClick={handleSwitchSourceClose}
                    >
                      {preferredSourceName}
                    </MenuItem>
                  )
                )}
              </Menu>
            </>
          )
        }
        // we can only be confident about the back url when viewing a collection's concepts
        allowImplicitNavigation
        backUrl={
          containerType !== DICTIONARY_CONTAINER ? undefined : containerUrl
        }
        backText={
          containerType === SOURCE_CONTAINER ? undefined : "Back to dictionary"
        }
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
              concepts={concepts || []}
              buttons={{
                edit: canModifyDictionary, // relevant for DICTIONARY_CONTAINER, condition already includes isDictionary condition
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
      </Header>
      {!canModifyDictionary ? null : (
        <>
          <Tooltip title="Add concepts">
            <Fab onClick={handleAddNewClick} color="primary" className="fab">
              <AddIcon />
            </Fab>
          </Tooltip>
          <Menu
            anchorEl={addNewAnchor}
            keepMounted
            open={Boolean(addNewAnchor)}
            onClose={handleAddNewClose}
          >
            <MenuItem
              onClick={e => {
                handleImportExistingClick(e);
                handleAddNewClose();
              }}
            >
              Import existing concept
            </MenuItem>
            {!linkedSource ? null : (
              <MenuItem
                onClick={e => {
                  handleCustomClick(e);
                  handleAddNewClose();
                }}
              >
                Create custom concept
              </MenuItem>
            )}
          </Menu>
        </>
      )}
      <Menu
        anchorEl={customAnchor}
        keepMounted
        open={Boolean(customAnchor)}
        onClose={handleCustomClose}
      >
        {CONCEPT_CLASSES.slice(0, 9).map(conceptClass => (
          <MenuItem onClick={handleCustomClose}>
            <Link
              className={classes.link}
              to={`${linkedSource}concepts/new/?conceptClass=${conceptClass}&linkedDictionary=${containerUrl}`}
            >
              {conceptClass} Concept
            </Link>
          </MenuItem>
        ))}
        <MenuItem onClick={handleCustomClose}>
          <Link
            className={classes.link}
            to={`${linkedSource}concepts/new/?linkedDictionary=${containerUrl}`}
          >
            Other kind
          </Link>
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={importExistingAnchor}
        keepMounted
        open={Boolean(importExistingAnchor)}
        onClose={handleImportExistingClose}
      >
        <MenuItem onClick={handleImportExistingClose}>
          <Link
            className={classes.link}
            to={`${PREFERRED_SOURCES_VIEW_ONLY[preferredSource]}concepts/?addToDictionary=${containerUrl}`}
          >
            Pick concepts
          </Link>
        </MenuItem>
        <MenuItem onClick={handleImportExistingClose}>
          <Link
            className={classes.link}
            to={`${containerUrl}add/?fromSource=${preferredSource}`}
          >
            Add bulk concepts
          </Link>
        </MenuItem>
      </Menu>
    </>
  );
};

const mapStateToProps = (state: AppState) => ({
  profile: profileSelector(state),
  usersOrgs: orgsSelector(state),
  concepts: state.concepts.concepts ? state.concepts.concepts.items : undefined,
  dictionary: dictionarySelector(state),
  meta: state.concepts.concepts
    ? state.concepts.concepts.responseMeta
    : undefined,
  loading:
    viewConceptsLoadingSelector(state) ||
    retrieveDictionaryLoadingSelector(state) ||
    removeConceptsFromDictionaryLoadingSelector(state),
  errors: viewConceptsErrorsSelector(state)
});

const mapActionsToProps = {
  retrieveConcepts: retrieveConceptsAction,
  retrieveDictionary: makeRetrieveDictionaryAction(true),
  addConceptsToDictionary: recursivelyAddConceptsToDictionaryAction,
  removeConceptsFromDictionary: removeReferencesFromDictionaryAction
};

export default connect<StateProps, ActionProps, OwnProps, AppState>(
  mapStateToProps,
  mapActionsToProps
)(ViewConceptsPage);
