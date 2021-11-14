import React from "react";
import {
  createStyles,
  lighten,
  makeStyles,
  Theme
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";

import TablePagination from "@material-ui/core/TablePagination";

import Paper from "@material-ui/core/Paper";

import { APIConcept, QueryParams, SortableField } from "../types";

import { EnhancedTableHead } from "./EnhancedTableHead";
import { EnhancedTableToolbar } from "./EnhancedTableToolbar";
import { ConceptsTableRow } from "./ConceptsTableRow";
import { TableBody } from "@material-ui/core";

interface Props extends QueryParams {
  concepts: APIConcept[];
  buildUrl: Function;
  goTo: Function;
  count: number;
  toggleShowOptions: Function;
  q: string;
  setQ: Function;
  buttons?: { [key: string]: boolean };
  addConceptsToDictionary: Function;
  dictionaryToAddTo?: string;
  removeConceptsFromDictionary: (conceptVersionUrls: string[]) => void;
  linkedDictionary?: string;
  linkedSource?: string;
  canModifyConcept: (concept: APIConcept) => boolean;
}

interface HeadCell {
  disablePadding: boolean;
  id: SortableField;
  label: string;
}

export const headCells: HeadCell[] = [
  { id: "name", disablePadding: false, label: "Name" },
  { id: "conceptClass", disablePadding: false, label: "Class" },
  { id: "datatype", disablePadding: false, label: "Datatype" },
  { id: "source", disablePadding: false, label: "Source" },
  { id: "id", disablePadding: false, label: "ID" }
];

export const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1)
    },
    highlight:
      theme.palette.type === "light"
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85)
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark
          },
    title: {
      flex: "1 1 100%"
    }
  })
);

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%"
    },
    paper: {
      width: "100%",
      marginBottom: theme.spacing(2)
    },
    table: {
      minWidth: 750
    },
    tableWrapper: {
      overflowX: "auto",
      height: "72vh"
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
  })
);

export const ConceptsTable: React.FC<Props> = ({
  concepts,
  buildUrl,
  goTo,
  count,
  q,
  setQ,
  page,
  limit,
  sortBy,
  sortDirection,
  toggleShowOptions,
  buttons = {},
  addConceptsToDictionary,
  dictionaryToAddTo,
  removeConceptsFromDictionary,
  // current dictionary, for editing and creating concepts
  linkedDictionary,
  // source to store new concepts in and use as criteria for whether a user can edit a concept
  linkedSource,
  canModifyConcept
}) => {
  const classes = useStyles();
  const [selected, setSelected] = React.useState<string[]>([]);
  const [menu, setMenu] = React.useState<{
    index: number;
    anchor: null | HTMLElement;
  }>({ index: -1, anchor: null });

  const resetSelected = () => setSelected([]);
  const isSelected = (uuid: string) => selected.includes(uuid);

  const toggleMenu = (
    index: number,
    event?: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (index === menu.index) setMenu({ index: -1, anchor: null });
    else if (event) setMenu({ index: index, anchor: event.currentTarget });
  };

  const setPage = (page: number) => goTo(buildUrl({ page: page + 1 }));
  const setOrder = (sortBy: string, sortDirection: string) =>
    goTo(buildUrl({ sortDirection, sortBy, page: 1 }));
  const setRowsPerPage = (limit: number) => goTo(buildUrl({ limit, page: 1 }));
  const search = (q: string) => goTo(buildUrl({ q, page: 1 }));

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: SortableField
  ) => {
    const isDesc = sortBy === property && sortDirection === "sortDesc";
    setOrder(property, isDesc ? "sortAsc" : "sortDesc");
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = concepts.map(concept => concept.uuid || "");
      setSelected(newSelecteds);
      return;
    }
    resetSelected();
  };

  const toggleSelect = (event: React.MouseEvent<unknown>, uuid: string) => {
    const selectedIndex = selected.indexOf(uuid);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, uuid);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          q={q}
          setQ={setQ}
          search={search}
          numSelected={selected.length}
          toggleShowOptions={toggleShowOptions}
          showAddConcepts={buttons.addToDictionary}
          addSelectedConcepts={() => {
            addConceptsToDictionary(
              concepts.filter(concept => selected.includes(concept.uuid || ""))
            );
            resetSelected();
          }}
        />
        <div className={classes.tableWrapper}>
          <Table
            stickyHeader
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={sortDirection}
              orderBy={sortBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={concepts.length}
            />
            <TableBody>
              {concepts.map((row, index) => {
                const isItemSelected = isSelected(row.uuid || "");
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <ConceptsTableRow
                    key={`${row.uuid}-${index}`}
                    row={row}
                    index={index}
                    selected={selected}
                    toggleSelect={toggleSelect}
                    linkedDictionary={linkedDictionary}
                    buttons={buttons}
                    linkedSource={linkedSource}
                    canModifyConcept={canModifyConcept}
                    toggleMenu={toggleMenu}
                    menu={menu}
                    removeConceptsFromDictionary={removeConceptsFromDictionary}
                    addConceptsToDictionary={addConceptsToDictionary}
                    dictionaryToAddTo={dictionaryToAddTo}
                    isItemSelected={isItemSelected}
                    labelId={labelId}
                  />
                );
              })}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={Number(count)}
          rowsPerPage={limit}
          page={page - 1}
          backIconButtonProps={{
            "aria-label": "previous page"
          }}
          nextIconButtonProps={{
            "aria-label": "next page"
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default ConceptsTable;
