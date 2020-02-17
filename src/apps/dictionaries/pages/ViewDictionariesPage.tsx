import React, { useEffect } from 'react'
import { AppState } from '../../../redux'
import { connect } from 'react-redux'
import { APIDictionary } from '../types'
import { ProgressOverlay } from '../../../utils/components'
import { useQuery } from '../../../utils'
import { useHistory, useLocation } from 'react-router'
import qs from 'qs'
import ViewDictionaries from '../components/ViewDictionaries'
import { Fab, Grid, Tooltip } from '@material-ui/core'
import { retrieveDictionariesLoadingSelector } from '../redux'
import { Add as AddIcon } from '@material-ui/icons'
import { Link } from 'react-router-dom'
import { retrieveDictionariesAction } from '../redux/actions'
import { ORG_DICTIONARIES_ACTION_INDEX, PERSONAL_DICTIONARIES_ACTION_INDEX } from '../redux/constants'

const PER_PAGE = 20;

interface Props {
  loading: boolean;
  personalDictionaries?: APIDictionary[];
  orgDictionaries?: APIDictionary[];
  personalMeta?: { num_found?: number };
  orgMeta?: { num_found?: number };
  retrieveDictionaries: (...args: Parameters<typeof retrieveDictionariesAction>) => void;
}

interface QueryParams {
  personalPage?: number;
  personalQ?: string;
  orgPage?: number;
  orgQ?: string;
}

const ViewDictionariesPage: React.FC<Props> = ({
  personalDictionaries = [],
  loading,
  retrieveDictionaries,
  personalMeta = {},
  orgDictionaries = [],
  orgMeta = {}
}: Props) => {
  const { push: goTo } = useHistory();
  const { pathname: url } = useLocation();
  const {
    num_found: numFoundPersonal = personalDictionaries.length
  } = personalMeta;
  const { num_found: numFoundOrgs = orgDictionaries.length } = orgMeta;

  const queryParams: QueryParams = useQuery();
  const {
    personalPage = 1,
    personalQ: initialPersonalQ = "",
    orgPage = 1,
    orgQ: initialOrgQ = ""
  } = queryParams;

  useEffect(() => {
    retrieveDictionaries(
      "/user/collections/",
      initialPersonalQ,
      PER_PAGE,
      personalPage,
      "/user/orgs/collections/",
      initialOrgQ,
      PER_PAGE,
      orgPage
    );
  }, [
    retrieveDictionaries,
    initialPersonalQ,
    personalPage,
    initialOrgQ,
    orgPage
  ]);

  const gimmeAUrl = (params: QueryParams) => {
    const newParams: QueryParams = { ...queryParams, ...params };
    return `${url}?${qs.stringify(newParams)}`;
  };

  return (
    <>
      <Grid item container xs={12}>
        <ProgressOverlay loading={loading}>
          <Grid item xs={6}>
            <ViewDictionaries
              title="Personal dictionaries"
              initialQ={initialPersonalQ}
              page={Number(personalPage)}
              onSearch={(personalQ: string) => goTo(gimmeAUrl({ personalQ }))}
              onPageChange={(page: number) => goTo(gimmeAUrl({ personalPage }))}
              dictionaries={personalDictionaries}
              numFound={numFoundPersonal}
            />
          </Grid>
          <Grid item xs={6}>
            <ViewDictionaries
              title="Your organizations' dictionaries"
              initialQ={initialOrgQ}
              page={Number(orgPage)}
              onSearch={(orgQ: string) => goTo(gimmeAUrl({ orgQ }))}
              onPageChange={(page: number) => goTo(gimmeAUrl({ orgPage }))}
              dictionaries={orgDictionaries}
              numFound={numFoundOrgs}
            />
          </Grid>
        </ProgressOverlay>
      </Grid>
      <Link to={`/collections/new/`}>
        <Tooltip title="Create new dictionary">
          <Fab color="primary" className="fab">
            <AddIcon />
          </Fab>
        </Tooltip>
      </Link>
    </>
  );
};

const mapStateToProps = (state: AppState) => ({
  loading: retrieveDictionariesLoadingSelector(state),
  personalDictionaries:
    state.dictionaries.dictionaries[PERSONAL_DICTIONARIES_ACTION_INDEX]?.items,
  personalMeta:
    state.dictionaries.dictionaries[PERSONAL_DICTIONARIES_ACTION_INDEX]
      ?.responseMeta,
  orgDictionaries:
    state.dictionaries.dictionaries[ORG_DICTIONARIES_ACTION_INDEX]?.items,
  orgMeta:
    state.dictionaries.dictionaries[ORG_DICTIONARIES_ACTION_INDEX]?.responseMeta
});

const mapDispatchToProps = {
  retrieveDictionaries: retrieveDictionariesAction
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewDictionariesPage);
