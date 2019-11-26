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

const PER_PAGE = 20;

interface Props {
  loading: boolean,
  dictionaries?: APIDictionary[],
  meta?: {num_found?: number},
  retrieveDictionaries: Function,
};

const useStyles = makeStyles({
  card: {
    minWidth: 275,
  },
  pagination: {
    justifyItems: 'center',
    display: 'grid',
    position: 'fixed',
    bottom: 0,
    background: '#fafafa', // todo hard coded color
    width: '100%',
  },
  search: {
    justifyItems: 'center',
    display: 'grid',
    position: 'sticky',
    background: '#fafafa', // todo hard coded color
    width: '100%',
    marginBottom: '2vw',
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
});

const ViewDictionariesPage: React.FC<Props> = ({dictionaries=[], loading, meta={}, retrieveDictionaries}) => {
  const classes = useStyles();
  const {push: goTo} = useHistory();
  const {pathname: url} = useLocation();
  const {num_found: numFound = dictionaries.length} = meta;

  const queryParams: {page?: number, q?: string} = useQuery();
  const {
    page=1,
    q: initialQ='',
  } = queryParams;

  const [q, setQ] = useState(initialQ);

  useEffect(() => {
    retrieveDictionaries('/collections/', initialQ, PER_PAGE, page);
  }, [retrieveDictionaries, initialQ, page]);

  const gimmeAUrl = (params: {page?: number, q?: string}) => {
    const newParams: {page?: number, q?: string} = {...queryParams, ...params};
    return `${url}?${qs.stringify(newParams)}`;
  };

  return (
    <ProgressOverlay loading={loading}>
      <Grid
        className={classes.search}
        item
        xs={5}
      >
        <form onSubmit={e => {e.preventDefault(); goTo(gimmeAUrl({q}));}}>
          <Input
            onChange={e => setQ(e.target.value)}
            value={q}
            fullWidth
            placeholder="Search"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => goTo(gimmeAUrl({q}))}
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        </form>
      </Grid>
      <Grid
        item
        xs={12}
      >
        <Grid
          container
          spacing={2}
          justify="center"
        >
          {dictionaries.length === 0 ? <Typography component="span" variant="h6">No dictionaries</Typography> : ''}
          {dictionaries.map(({name, short_code: shortCode, owner, owner_type: ownerType, description, url}) => (
            <Grid
              item
              xs={3}
            >
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="body1" color="textSecondary" gutterBottom>
                    {shortCode}
                  </Typography>
                  <Typography variant="h5">
                    {name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {ownerType}/{owner}
                  </Typography>
                  <Typography variant="body1" component="p">
                    {description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" variant="text" color='primary'>
                    <Link className={classes.link} to={url.replace('/collections/', '/dictionaries/')}>View</Link>
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item xs={12} className={classes.pagination}>
        <TablePagination
          rowsPerPageOptions={[PER_PAGE]}
          count={numFound}
          rowsPerPage={PER_PAGE}
          page={page - 1}
          backIconButtonProps={{
            'aria-label': 'previous page',
          }}
          nextIconButtonProps={{
            'aria-label': 'next page',
          }}
          onChangePage={(_: any, page: number) => goTo(gimmeAUrl({page: page - 1}))}
        />
      </Grid>
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewDictionariesPage);
