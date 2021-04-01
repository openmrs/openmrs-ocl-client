import React from "react";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { SortableField } from "../types";
import { useStyles, headCells } from "./ConceptsTable";

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: SortableField
  ) => void;
  onSelectAllClick: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void;
  order: "sortAsc" | "sortDesc";
  orderBy: string;
  rowCount: number;
}
export function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort
  } = props;
  const createSortHandler = (property: SortableField) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead data-testid="conceptsTableHeader">
      <TableRow>
        {numSelected <= 0 ? null : (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{ "aria-label": "select all desserts" }}
            />
          </TableCell>
        )}
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={
              orderBy === headCell.id
                ? order === "sortAsc"
                  ? "asc"
                  : "desc"
                : false
            }
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={order === "sortAsc" ? "asc" : "desc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "sortDesc"
                    ? "sorted descending"
                    : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell padding="checkbox" />
      </TableRow>
    </TableHead>
  );
}
