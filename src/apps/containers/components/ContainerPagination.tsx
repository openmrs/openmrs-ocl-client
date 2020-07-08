import React from "react";
import { createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import TablePagination from "@material-ui/core/TablePagination";

interface Props {
  num_found: number;
  per_page: number;
  page: number;
  onPageChange: Function;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pagination: {
      justifyItems: "center",
      display: "grid",
      position: "fixed",
      bottom: 0,
      background: theme.palette.background.default,
      width: "100%",
    },
  })
);
const ContainerPagination: React.FC<Props> = ({
  num_found,
  per_page,
  page,
  onPageChange,
}) => {
  const classes = useStyles();

  return (
    <Grid item xs={12} className={classes.pagination}>
      <TablePagination
        rowsPerPageOptions={[per_page]}
        component='div'
        count={Number(num_found)}
        rowsPerPage={per_page}
        page={page - 1}
        backIconButtonProps={{
          "aria-label": "previous page",
        }}
        nextIconButtonProps={{
          "aria-label": "next page",
        }}
        onChangePage={(_: any, page: number) => onPageChange(page + 1)}
      />
    </Grid>
  );
};

export default ContainerPagination;
