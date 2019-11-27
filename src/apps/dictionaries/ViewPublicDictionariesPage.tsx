import React, { useEffect, useState } from 'react'
import { AppState } from '../../redux'
import {
  retrieveDictionariesAction, retrieveDictionariesLoadingSelector
} from './redux'
import { connect } from 'react-redux'
import { APIDictionary } from './types'
import { ProgressOverlay } from '../../utils/components'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Input,
  InputAdornment,
  makeStyles,
  Typography
} from '@material-ui/core'
import TablePagination from '@material-ui/core/TablePagination'
import { useQuery } from '../../utils'
import { useHistory, useLocation } from 'react-router'
import qs from 'qs'
import IconButton from '@material-ui/core/IconButton'
import { Search as SearchIcon } from '@material-ui/icons'
import { Link } from 'react-router-dom'
import ViewDictionaries from './components/ViewDictionaries'

const PER_PAGE = 20;

interface Props {
  loading: boolean,
  dictionaries?: APIDictionary[],
  meta?: {num_found?: number},
  retrieveDictionaries: Function,
};

const ViewPublicDictionariesPage: React.FC<Props> = ({dictionaries=[], loading, meta={}, retrieveDictionaries}) => {
  const {push: goTo} = useHistory();
  const {pathname: url} = useLocation();
  const {num_found: numFound = dictionaries.length} = meta;

  const queryParams: {page?: number, q?: string} = useQuery();
  const {
    page=1,
    q: initialQ='',
  } = queryParams;

  useEffect(() => {
    retrieveDictionaries('/collections/', initialQ, PER_PAGE, page);
  }, [retrieveDictionaries, initialQ, page]);

  const gimmeAUrl = (params: {page?: number, q?: string}) => {
    const newParams: {page?: number, q?: string} = {...queryParams, ...params};
    return `${url}?${qs.stringify(newParams)}`;
  };

  return (
    <ProgressOverlay loading={loading}>
      <ViewDictionaries initialQ={initialQ} page={page} onSearch={(q: string) => goTo(gimmeAUrl({q}))} onPageChange={(page: number) => goTo(gimmeAUrl({page}))} dictionaries={dictionaries} numFound={numFound}/>
    </ProgressOverlay>
  );
}


const mapStateToProps = (state: AppState) => ({
  loading: retrieveDictionariesLoadingSelector(state),
  dictionaries: state.dictionaries.dictionaries ? state.dictionaries.dictionaries.items : [],
  meta: state.dictionaries.dictionaries ? state.dictionaries.dictionaries.responseMeta : {},
});

const mapDispatchToProps = {
  retrieveDictionaries: retrieveDictionariesAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewPublicDictionariesPage);
