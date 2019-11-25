import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { Grid } from '@material-ui/core'
import { ConceptsTable } from './components'
import { connect } from 'react-redux'
import { retrieveConceptsAction, viewConceptsLoadingSelector, viewConceptsErrorsSelector } from './redux'
import { AppState } from '../../redux'
import { APIConcept, OptionalQueryParams as QueryParams } from './types'
import { useLocation, useHistory } from 'react-router'
import {useQuery } from '../../utils'
import qs from 'qs'
import { ProgressOverlay } from '../../utils/components'
import FilterOptions from './components/FilterOptions'

interface Props {
  concepts?: APIConcept[],
  loading: boolean,
  errors?: {},
  retrieveConcepts: Function,
  meta?: {num_found?: number},
}

const ViewConceptsPage: React.FC<Props> = ({concepts, loading, errors, retrieveConcepts, meta={}}) => {
  const {push: goTo} = useHistory();
  const {pathname: url} = useLocation();
  const sourceUrl = url.replace('/concepts/', '');

  const queryParams: QueryParams = useQuery(); // todo get limit from settings
  const {q='', page=1, sortDirection='sortAsc', sortBy='id', limit=10, classFilters=[], dataTypeFilters=[]} = queryParams;

  console.log(classFilters, dataTypeFilters);

  const [showOptions, setShowOptions] = useState(true);

  const gimmeAUrl = (params: QueryParams) => {
    const newParams: QueryParams = {...queryParams, ...params};
    return `${url}?${qs.stringify(newParams)}`;
  };

  useEffect(() => {
    retrieveConcepts(sourceUrl, page, limit, q, sortDirection, sortBy, dataTypeFilters, classFilters);
  }, [retrieveConcepts, sourceUrl, page, limit, q, sortDirection, sortBy, dataTypeFilters.toString(), classFilters.toString()]);

  return (
    <Header title="Concepts" justifyChildren="space-around">
      <ProgressOverlay loading={loading}>
        <Grid id="viewConceptsPage" item xs={showOptions ? 9 : 12} component="div">
          <ConceptsTable
            concepts={concepts || []}
            q={q}
            page={page}
            sortDirection={sortDirection}
            sortBy={sortBy}
            limit={Number(limit)}
            buildUrl={gimmeAUrl}
            goTo={goTo}
            count={meta.num_found ? Number(meta.num_found) : (concepts ? concepts.length : 0)}
            toggleShowOptions={() => setShowOptions(!showOptions)}
          />
        </Grid>
        {!showOptions ? '' : (
          <Grid item xs={2} component="div">
            <FilterOptions buildUrl={gimmeAUrl} classFilters={classFilters} dataTypeFilters={dataTypeFilters} />
          </Grid>
        )}
      </ProgressOverlay>
    </Header>
  );
};

const mapStateToProps = (state: AppState) => ({
  concepts: state.concepts.concepts ? state.concepts.concepts.items : undefined,
  meta: state.concepts.concepts ? state.concepts.concepts.responseMeta : undefined,
  loading: viewConceptsLoadingSelector(state),
  errors: viewConceptsErrorsSelector(state),
});

const mapActionsToProps = {
  retrieveConcepts: retrieveConceptsAction,
};

export default connect(mapStateToProps, mapActionsToProps)(ViewConceptsPage);
