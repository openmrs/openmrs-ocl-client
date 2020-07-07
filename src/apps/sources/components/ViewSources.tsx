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
import { APISource } from "../types";
import clsx from "clsx";

const PER_PAGE = 20;

interface Props {
  sources: APISource[];
  numFound: number;
  onPageChange: Function;
  onSearch: Function;
  page: number;
  initialQ: string;
  title?: string;
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
    sourceName: {
      overflowX: "auto"
    }
  })
);

const ViewSources: React.FC<Props> = ({
  sources,
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
      <Grid className={classes.searchContainer} item xs={12} >
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
            type="search"
            fullWidth
            placeholder="Search Sources"
            data-testid="sourcesSearch"
            endAdornment={
              <InputAdornment position="end">
                <IconButton data-testid="sourcesSearchButton" onClick={() => onSearch(q)}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        </form>
      </Grid>
      <Grid item xs={12} container spacing={2} justify="center" data-testid="sources">
        {sources.length === 0 ? (
          <Typography component="span" variant="h6">
            No Sources Found
          </Typography>
        ) : (
          ""
        )}
        {sources.map(
          ({
            name,
            short_code: shortCode,
            owner,
            owner_type: ownerType,
            description,
            url
          }) => (
            <Grid item key={shortCode} xs={4}>
              <Card data-testid={shortCode}>
                <CardContent>
                  <Typography
                    noWrap
                    variant="body1"
                    color="textSecondary"
                    gutterBottom
                    data-testid={"sourceShortCode - " + shortCode}
                  >
                    {shortCode}
                  </Typography>
                  <Typography
                    className={classes.sourceName}
                    noWrap
                    variant="h5"
                    data-testid={"sourceName - " + shortCode}
                  >
                    {name}
                  </Typography>
                  <Typography noWrap variant="body2" color="textSecondary" data-testid={"sourceOwnerTypeAndOwner - " + shortCode}>
                    {ownerType}/{owner}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    to={url}
                    component={Link}
                    size="small"
                    variant="text"
                    color="primary"
                    disabled={true}
                    data-testid="viewButton"
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
          data-testid="sourcesPagination"
          onChangePage={(_: any, page: number) => onPageChange(page + 1)}
        />
      </Grid>
    </>
  );
};

export default ViewSources;
