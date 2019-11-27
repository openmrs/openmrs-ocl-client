import React, { useEffect } from 'react'
import { AppState } from '../../redux'
import { connect } from 'react-redux'
import { APIDictionary } from './types'
import { ProgressOverlay } from '../../utils/components'
import { useQuery } from '../../utils'
import { useHistory, useLocation } from 'react-router'
import qs from 'qs'
import ViewDictionaries from './components/ViewDictionaries'
import { Grid } from '@material-ui/core'
import {
  ORG_DICTIONARIES_ACTION_INDEX,
  PERSONAL_DICTIONARIES_ACTION_INDEX, retrieveOrgDictionariesAction,
  retrieveOrgDictionariesLoadingSelector, retrievePersonalDictionariesAction,
  retrievePersonalDictionariesLoadingSelector
} from './redux'

const PER_PAGE = 20;

interface Props {
  loadingPersonal: boolean,
  loadingOrgs: boolean,
  personalDictionaries?: APIDictionary[],
  orgDictionaries?: APIDictionary[],
  personalMeta?: {num_found?: number},
  orgMeta?: {num_found?: number},
  retrievePersonalDictionaries: Function,
  retrieveOrgDictionaries: Function,
};

interface QueryParams {personalPage?: number, personalQ?: string, orgPage?: number, orgQ?: string}

const ViewDictionariesPage: React.FC<Props> = ({
  personalDictionaries=[],
  loadingPersonal,
  personalMeta={},
  retrievePersonalDictionaries,
  orgDictionaries=[],
  loadingOrgs,
  orgMeta={},
  retrieveOrgDictionaries,
}: Props) => {

  const {push: goTo} = useHistory();
  const {pathname: url} = useLocation();
  const {num_found: numFoundPersonal = personalDictionaries.length} = personalMeta;
  const {num_found: numFoundOrgs = orgDictionaries.length} = orgMeta;

  const queryParams: QueryParams = useQuery();
  const {
    personalPage=1,
    personalQ: initialPersonalQ='',
    orgPage=1,
    orgQ: initialOrgQ='',
  } = queryParams;

  useEffect(() => {
    retrievePersonalDictionaries('/user/collections/', initialPersonalQ, PER_PAGE, personalPage);
  }, [retrievePersonalDictionaries, initialPersonalQ, personalPage]);

  useEffect(() => {
    retrieveOrgDictionaries('/user/orgs/collections/', initialOrgQ, PER_PAGE, orgPage);
  }, [retrieveOrgDictionaries, initialOrgQ, orgPage]);

  const gimmeAUrl = (params: QueryParams) => {
    const newParams: QueryParams = {...queryParams, ...params};
    return `${url}?${qs.stringify(newParams)}`;
  };

  return (
    <Grid item container xs={12}>
      <ProgressOverlay loading={loadingPersonal || loadingOrgs}>
        <Grid item xs={6}>
          <ViewDictionaries
            title="Personal dictionaries"
            initialQ={initialPersonalQ}
            page={personalPage}
            onSearch={(personalQ: string) => goTo(gimmeAUrl({personalQ}))}
            onPageChange={(page: number) => goTo(gimmeAUrl({personalPage}))}
            dictionaries={personalDictionaries}
            numFound={numFoundPersonal}
          />
        </Grid>
        <Grid item xs={6}>
          <ViewDictionaries
            title="Your organizations' dictionaries"
            initialQ={initialOrgQ}
            page={orgPage}
            onSearch={(orgQ: string) => goTo(gimmeAUrl({orgQ}))}
            onPageChange={(page: number) => goTo(gimmeAUrl({orgPage}))}
            dictionaries={orgDictionaries} numFound={numFoundOrgs}
          />
        </Grid>
      </ProgressOverlay>
    </Grid>
  );
}

const mapStateToProps = (state: AppState) => ({
  loadingPersonal: retrievePersonalDictionariesLoadingSelector(state),
  loadingOrgs: retrieveOrgDictionariesLoadingSelector(state),
  personalDictionaries: state.dictionaries.dictionaries[PERSONAL_DICTIONARIES_ACTION_INDEX]?.items,
  personalMeta: state.dictionaries.dictionaries[PERSONAL_DICTIONARIES_ACTION_INDEX]?.responseMeta,
  orgDictionaries: state.dictionaries.dictionaries[ORG_DICTIONARIES_ACTION_INDEX]?.items,
  orgMeta: state.dictionaries.dictionaries[ORG_DICTIONARIES_ACTION_INDEX]?.responseMeta,
});

const mapDispatchToProps = {
  retrievePersonalDictionaries: retrievePersonalDictionariesAction,
  retrieveOrgDictionaries: retrieveOrgDictionariesAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewDictionariesPage);
