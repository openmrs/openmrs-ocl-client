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
import clsx from 'clsx'

const PER_PAGE = 20;

interface Props {
  dictionaries: APIDictionary[];
  numFound: number;
  onPageChange: Function;
  onSearch: Function;
  page: number;
  initialQ: string;
  title?: string;
}

const useStyles = makeStyles({
  pagination: {
    justifyItems: "center",
    display: "grid",
    position: "fixed",
    bottom: 0,
    background: "transparent"
  },
  paginationDouble: {
    width: "100%"
  },
  paginationSingle: {
    width: "50%"
  },
  title: {
    marginBottom: "2vw"
  },
  search: {
    justifyItems: "center",
    display: "grid",
    position: "sticky",
    background: "transparent",
    width: "100%",
    marginBottom: "2vw"
  },
  link: {
    textDecoration: "none",
    color: "inherit"
  },
  dictionaryName: {
    overflowX: "auto"
  }
});

const ViewDictionaries: React.FC<Props> = ({
  dictionaries,
  numFound,
  onPageChange,
  onSearch,
  page,
  initialQ,
  title
}) => {
  const classes = useStyles();
  const [q, setQ] = useState(initialQ);

  return (
    <>
      {!title ? (
        ""
      ) : (
        <Grid item xs={12}>
          <Typography
            align="center"
            className={classes.title}
            gutterBottom
            variant="h5"
          >
            {title}
          </Typography>
        </Grid>
      )}
      <Grid className={classes.search} item xs={12}>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSearch(q);
          }}
        >
          <Input
            onChange={e => setQ(e.target.value)}
            value={q}
            fullWidth
            placeholder="Search"
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => onSearch(q)}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        </form>
      </Grid>
      <Grid item xs={12} container spacing={2} justify="center">
        {dictionaries.length === 0 ? (
          <Typography component="span" variant="h6">
            No dictionaries
          </Typography>
        ) : (
          ""
        )}
        {dictionaries.map(
          ({
            name,
            short_code: shortCode,
            owner,
            owner_type: ownerType,
            description,
            url
          }) => (
            <Grid item key={shortCode} xs={4}>
              <Card>
                <CardContent>
                  <Typography
                    noWrap
                    variant="body1"
                    color="textSecondary"
                    gutterBottom
                  >
                    {shortCode}
                  </Typography>
                  <Typography
                    className={classes.dictionaryName}
                    noWrap
                    variant="h5"
                  >
                    {name}
                  </Typography>
                  <Typography noWrap variant="body2" color="textSecondary">
                    {ownerType}/{owner}
                  </Typography>
                  <Typography noWrap variant="body1" component="p">
                    {description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" variant="text" color="primary">
                    <Link className={classes.link} to={url}>
                      View
                    </Link>
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )
        )}
      </Grid>
      <Grid
        item
        xs={12}
        className={clsx(
          classes.pagination,
          title ? classes.paginationSingle : classes.paginationDouble
        )}
      >
        <TablePagination
          rowsPerPageOptions={[PER_PAGE]}
          component="div"
          count={Number(numFound)}
          rowsPerPage={PER_PAGE}
          page={page - 1}
          backIconButtonProps={{
            "aria-label": "previous page"
          }}
          nextIconButtonProps={{
            "aria-label": "next page"
          }}
          onChangePage={(_: any, page: number) => onPageChange(page + 1)}
        />
      </Grid>
    </>
  );
};

export default ViewDictionaries;
