import React, { useState } from 'react'
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
import IconButton from '@material-ui/core/IconButton'
import { Search as SearchIcon } from '@material-ui/icons'
import { Link } from 'react-router-dom'
import { APIDictionary } from '../types'

const PER_PAGE = 20;

interface Props {
  dictionaries: APIDictionary[],
  numFound: number,
  onPageChange: Function,
  onSearch: Function,
  page: number,
  initialQ: string,
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

const ViewDictionaries: React.FC<Props> = ({dictionaries, numFound, onPageChange, onSearch, page, initialQ}) => {
  const classes = useStyles();
  const [q, setQ] = useState(initialQ);

  return (
    <>
      <Grid
        className={classes.search}
        item
        xs={5}
      >
        <form onSubmit={e => {e.preventDefault(); onSearch(q);}}>
          <Input
            onChange={e => setQ(e.target.value)}
            value={q}
            fullWidth
            placeholder="Search"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => onSearch(q)}
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
          onChangePage={(_: any, page: number) => onPageChange(page + 1)}
        />
      </Grid>
    </>
  );
}


export default ViewDictionaries;
