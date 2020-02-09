import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header'
import { Fab, Grid, makeStyles, Menu, MenuItem, Tooltip } from '@material-ui/core'
import { ConceptsTable } from '../components'
import { connect } from 'react-redux'
import { retrieveConceptsAction, viewConceptsErrorsSelector, viewConceptsLoadingSelector } from '../redux'
import { AppState } from '../../../redux'
import { APIConcept, OptionalQueryParams as QueryParams } from '../types'
import { useHistory, useLocation, useParams } from 'react-router'
import { CONCEPT_CLASSES, useAnchor, useQuery } from '../../../utils'
import qs from 'qs'
import { ProgressOverlay } from '../../../utils/components'
import FilterOptions from '../components/FilterOptions'
import { Add as AddIcon } from '@material-ui/icons'
import { Link } from 'react-router-dom'
import { APIOrg, APIProfile, canModifyContainer, profileSelector } from '../../authentication'
import { orgsSelector } from '../../authentication/redux/reducer'
import { CIEL_CONCEPTS_URL, DICTIONARY_VERSION_CONTAINER, FILTER_SOURCE_IDS, } from '../constants'
import { CIEL_SOURCE_URL } from '../../../utils/constants'
import { addCIELConceptsToDictionaryAction } from '../../dictionaries/redux'
import { getSourceIdFromUrl } from '../utils'

interface Props {
  concepts?: APIConcept[];
  loading: boolean;
  errors?: {};
  retrieveConcepts: Function;
  meta?: { num_found?: number };
  profile?: APIProfile;
  usersOrgs?: APIOrg[];
  containerType: string;
  addConceptsToDictionary: Function;
}

const useStyles = makeStyles({
  link: {
    textDecoration: "none",
    color: "inherit",
    width: "100%"
  }
});

const INITIAL_LIMIT = 10;  // todo get limit from settings

const ViewConceptsPage: React.FC<Props> = ({
  concepts,
  loading,
  errors,
  retrieveConcepts,
  meta = {},
  profile,
  usersOrgs,
  containerType,
  addConceptsToDictionary
}) => {
  const classes = useStyles();

  const isDictionaryVersion = containerType === DICTIONARY_VERSION_CONTAINER;
  const { push: goTo } = useHistory();
  const { pathname: url } = useLocation();
  const dictionaryUrl = url.replace("/concepts", "");
  const { ownerType, owner } = useParams<{
    ownerType: string;
    owner: string;
  }>();
  const {linkedSource} = useQuery();

  const [addNewAnchor, handleAddNewClick, handleAddNewClose] = useAnchor();
  const [customAnchor, handleCustomClick, handleCustomClose] = useAnchor();
  const [importExistingAnchor, handleImportExistingClick, handleImportExistingClose] = useAnchor();

  const queryParams: QueryParams = useQuery();
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
  const [sourceFilters, setSourceFilters] = useState<string[]>(initialSourceFilters);
  const [q, setQ] = useState(initialQ);
  const canModify =
    !isDictionaryVersion && canModifyContainer(ownerType, owner, profile, usersOrgs);

  const gimmeAUrl = (params: QueryParams={}) => {
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
    return `${url}?${qs.stringify(newParams)}`;
  };

  useEffect(() => {
    // we don't make this reactive(only depend on the initial values), because the requirement
    // was only trigger queries on user search(enter or apply filters, or change page)
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
      true,
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
    initialSourceFilters.toString(),
  ]);

  return (
    <>
      <Header title="Concepts" justifyChildren="space-around" backUrl={!isDictionaryVersion ? dictionaryUrl : undefined}>
        <ProgressOverlay loading={loading}>
          <Grid
            id="viewConceptsPage"
            item
            xs={showOptions ? 9 : 12}
            component="div"
          >
            <ConceptsTable
              concepts={concepts || []}
              buttons={{
                edit: canModify && !!dictionaryUrl,
                addToDictionary: !!dictionaryToAddTo,
              }}
              q={q}
              setQ={setQ}
              page={page}
              sortDirection={sortDirection}
              sortBy={sortBy}
              limit={Number(limit)}
              buildUrl={gimmeAUrl}
              goTo={goTo}
              count={
                meta.num_found
                  ? Number(meta.num_found)
                  : concepts
                  ? concepts.length
                  : 0
              }
              toggleShowOptions={() => setShowOptions(!showOptions)}
              addConceptsToDictionary={(concepts: APIConcept[]) =>
                addConceptsToDictionary(dictionaryToAddTo, concepts)
              }
              linkedDictionary={dictionaryUrl}
              linkedSource={linkedSource}
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
                // interesting how we generate these, isn't it? yeah well, this is an important feature, so there :)
                sourceOptions={[...FILTER_SOURCE_IDS, getSourceIdFromUrl(linkedSource)].filter(source => source !== undefined) as string[]}
                url={gimmeAUrl()}
              />
            </Grid>
          )}
        </ProgressOverlay>
      </Header>
      {(!canModify || (containerType === DICTIONARY_VERSION_CONTAINER)) ? null : (
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
            <MenuItem onClick={e => {handleImportExistingClick(e); handleAddNewClose()}}>
              Import existing concept
            </MenuItem>
            {!linkedSource ? null : (
              <MenuItem onClick={e => {handleCustomClick(e); handleAddNewClose()}}>
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
              to={`${linkedSource}concepts/new/?conceptClass=${conceptClass}&linkedDictionary=${dictionaryUrl}`}
            >
              {conceptClass} Concept
            </Link>
          </MenuItem>
        ))}
        <MenuItem onClick={handleCustomClose}>
          <Link className={classes.link} to={`${linkedSource}concepts/new/?linkedDictionary=${dictionaryUrl}`}>
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
            to={`${CIEL_CONCEPTS_URL}?addToDictionary=${dictionaryUrl}`}
          >
            Pick concepts
          </Link>
        </MenuItem>
        <MenuItem onClick={handleImportExistingClose}>
          <Link
            className={classes.link}
            to={`${dictionaryUrl}add/?fromSource=${CIEL_SOURCE_URL}`}
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
  meta: state.concepts.concepts
    ? state.concepts.concepts.responseMeta
    : undefined,
  loading: viewConceptsLoadingSelector(state),
  errors: viewConceptsErrorsSelector(state)
});

const mapActionsToProps = {
  retrieveConcepts: retrieveConceptsAction,
  addConceptsToDictionary: addCIELConceptsToDictionaryAction
};

export default connect(mapStateToProps, mapActionsToProps)(ViewConceptsPage);
