import React from "react";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import { makeStyles } from "@material-ui/core";

interface EnhancedNotificationSummaryTableHeadProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  order: "asc" | "desc";
  orderBy: string;
}

const useStyles = makeStyles({
  tableHeadCell: {
    minWidth: "150px"
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  }
});

export function EnhancedNotificationSummaryTableHead(
  props: EnhancedNotificationSummaryTableHeadProps
) {
  const { order, orderBy, onRequestSort } = props;

  const classes = useStyles();

  const headCells = [
    { id: "conceptId", label: "Concept ID" },
    { id: "conceptType", label: "Concept Type" },
    { id: "status", label: "Status" },
    { id: "reasons", label: "Reasons" }
  ];

  const createSortHandler = (property: string) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead data-testid="enhancedTableHead">
      <TableRow>
        <TableCell>S.No</TableCell>
        {headCells.map(headCell => (
          <TableCell
            className={classes.tableHeadCell}
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
