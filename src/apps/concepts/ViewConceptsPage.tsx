import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { Fab, Grid, makeStyles, Menu, MenuItem, Tooltip } from '@material-ui/core'
import { ConceptsTable } from './components'
import { connect } from 'react-redux'
import { retrieveConceptsAction, viewConceptsLoadingSelector, viewConceptsErrorsSelector } from './redux'
import { AppState } from '../../redux'
import { APIConcept, OptionalQueryParams as QueryParams } from './types'
import { useLocation, useHistory, useParams } from 'react-router'
import { CONCEPT_CLASSES, useQuery } from '../../utils'
import qs from 'qs'
import { ProgressOverlay } from '../../utils/components'
import FilterOptions from './components/FilterOptions'
import { Add as AddIcon } from '@material-ui/icons'
import { Link } from 'react-router-dom'
import { APIOrg, APIProfile, canModifyContainer, profileSelector } from '../authentication'
import { orgsSelector } from '../authentication/redux/reducer'
import { CIEL_CONCEPTS_URL, SOURCE_CONTAINER } from './constants'
import { CIEL_SOURCE_URL } from '../../utils/constants'
import { addConceptsToCollectionAction } from '../collections'

interface Props {
  concepts?: APIConcept[],
  loading: boolean,
  errors?: {},
  retrieveConcepts: Function,
  meta?: { num_found?: number },
  profile?: APIProfile,
  usersOrgs?: APIOrg[],
  containerType: string,
  addConceptsToCollection: Function,
}

const useStyles = makeStyles({
  link: {
    textDecoration: 'none',
    color: 'inherit',
    width: '100%',
  },
})

const ViewConceptsPage: React.FC<Props> = ({ concepts, loading, errors, retrieveConcepts, meta = {}, profile, usersOrgs, containerType, addConceptsToCollection }) => {
  const classes = useStyles()

  const { push: goTo } = useHistory()
  const { pathname: url } = useLocation()
  const sourceOrCollectionUrl = url.replace('/concepts', '')
  const { ownerType, owner } = useParams<{ ownerType: string, owner: string }>()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const queryParams: QueryParams = useQuery() // todo get limit from settings
  const {
    page = 1,
    sortDirection = 'sortAsc',
    sortBy = 'id',
    limit = 25,
    q: initialQ = '',
    classFilters: initialClassFilters = [],
    dataTypeFilters: initialDataTypeFilters = [],
    addToCollection: collectionToAddTo,
  } = queryParams

  const [showOptions, setShowOptions] = useState(true)
  const [classFilters, setClassFilters] = useState<string[]>(initialClassFilters)
  const [dataTypeFilters, setInitialDataTypeFilters] = useState<string[]>(initialDataTypeFilters)
  const [q, setQ] = useState(initialQ)
  const canModifySource = canModifyContainer(ownerType, owner, profile, usersOrgs)

  const gimmeAUrl = (params: QueryParams) => {
    const newParams: QueryParams = {
      ...queryParams, ...{
        classFilters: classFilters,
        dataTypeFilters: dataTypeFilters,
        page: 1,
        q
      }, ...params
    }
    return `${url}?${qs.stringify(newParams)}`
  }

  useEffect(() => {
    retrieveConcepts(url, page, limit, initialQ, sortDirection, sortBy, initialDataTypeFilters, initialClassFilters)
  }, [retrieveConcepts, url, page, limit, initialQ, sortDirection, sortBy, initialDataTypeFilters.toString(), initialClassFilters.toString()])

  return (
    <>
      <Header title="Concepts" justifyChildren="space-around">
        <ProgressOverlay loading={loading}>
          <Grid id="viewConceptsPage" item xs={showOptions ? 9 : 12} component="div">
            <ConceptsTable
              concepts={concepts || []}
              buttons={{
                edit: canModifySource,
                addToCollection: !!collectionToAddTo,
              }}
              q={q}
              setQ={setQ}
              page={page}
              sortDirection={sortDirection}
              sortBy={sortBy}
              limit={Number(limit)}
              buildUrl={gimmeAUrl}
              goTo={goTo}
              count={meta.num_found ? Number(meta.num_found) : (concepts ? concepts.length : 0)}
              toggleShowOptions={() => setShowOptions(!showOptions)}
              addConceptsToCollection={(concepts: APIConcept[]) => addConceptsToCollection(collectionToAddTo, concepts)}
            />
          </Grid>
          {!showOptions ? '' : (
            <Grid item xs={2} component="div">
              <FilterOptions checkedClasses={classFilters} setCheckedClasses={setClassFilters}
                             checkedDataTypes={dataTypeFilters} setCheckedDataTypes={setInitialDataTypeFilters}
                             url={gimmeAUrl({})}/>
            </Grid>
          )}
        </ProgressOverlay>
      </Header>
      {!canModifySource ? null : containerType === SOURCE_CONTAINER ? (
        <>
          <Tooltip title="Create a new concept">
            <Fab onClick={handleClick} color="primary" className="fab">
              <AddIcon/>
            </Fab>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {CONCEPT_CLASSES.slice(0, 9).map(conceptClass => (
              <MenuItem onClick={handleClose}><Link className={classes.link}
                                                    to={`${url}new/?conceptClass=${conceptClass}`}>{conceptClass} Concept</Link></MenuItem>
            ))}
            <MenuItem onClick={handleClose}><Link className={classes.link} to={`${url}new/`}>Other
              kind</Link></MenuItem>
          </Menu>
        </>
      ) : (
        <>
          <Tooltip title="Add CIEL concepts">
            <Fab onClick={handleClick} color="primary" className="fab">
              <AddIcon/>
            </Fab>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}><Link className={classes.link}
                                                  to={`${CIEL_CONCEPTS_URL}?addToCollection=${sourceOrCollectionUrl}`}>Add
              single concept</Link></MenuItem>
            <MenuItem onClick={handleClose}><Link className={classes.link}
                                                  to={`${sourceOrCollectionUrl}add/?fromSource=${CIEL_SOURCE_URL}`}>Add
              bulk
              concepts</Link></MenuItem>
          </Menu>
        </>
      )}
    </>
  )
}

const mapStateToProps = (state: AppState) => ({
  profile: profileSelector(state),
  usersOrgs: orgsSelector(state),
  concepts: state.concepts.concepts ? state.concepts.concepts.items : undefined,
  meta: state.concepts.concepts ? state.concepts.concepts.responseMeta : undefined,
  loading: viewConceptsLoadingSelector(state),
  errors: viewConceptsErrorsSelector(state),
})

const mapActionsToProps = {
  retrieveConcepts: retrieveConceptsAction,
  addConceptsToCollection: addConceptsToCollectionAction,
}

export default connect(mapStateToProps, mapActionsToProps)(ViewConceptsPage)
