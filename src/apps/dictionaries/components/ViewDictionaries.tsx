import React, { useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  createStyles,
  Grid,
  Input,
  InputAdornment,
  makeStyles,
  Theme,
  Typography
} from "@material-ui/core";
import TablePagination from "@material-ui/core/TablePagination";
import IconButton from "@material-ui/core/IconButton";
import { Search as SearchIcon } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { APIDictionary } from "../types";

const PER_PAGE = 20;

interface Props {
  dictionaries: APIDictionary[];
  numFound: number;
  onPageChange: Function;
  onSearch: Function;
  page: number;
  initialQ: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pagination: {
      justifyItems: "center",
      display: "grid",
      position: "fixed",
      bottom: 0,
      background: theme.palette.background.default,
      width: "100%"
    },
    title: {
      marginBottom: "2vw"
    },
    searchInput: {
      textAlign: "center",
      fontSize: "larger"
    },
    searchContainer: {
      justifyItems: "center",
      display: "grid",
      position: "sticky",
      background: "transparent",
      width: "100%",
      margin: theme.spacing(2),
      padding: theme.spacing(2)
    },
    dictionaryName: {
      overflowX: "auto"
    }
  })
);

const ViewDictionaries: React.FC<Props> = ({
  dictionaries,
  numFound,
  onPageChange,
  onSearch,
  page,
  initialQ
}) => {
  const classes = useStyles();
  const [q, setQ] = useState(initialQ);

  return (
    <>
      <Grid className={classes.searchContainer} item xs={12}>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSearch(q);
          }}
        >
          <Input
            inputProps={{
              className: classes.searchInput
            }}
            onChange={e => setQ(e.target.value)}
            value={q}
            color="secondary"
            type="search"
            fullWidth
            placeholder="Search Dictionaries"
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
                  <Button
                    to={url}
                    component={Link}
                    size="small"
                    variant="text"
                    color="primary"
                  >
                    View
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )
        )}
      </Grid>
      <Grid item xs={12} className={classes.pagination}>
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
