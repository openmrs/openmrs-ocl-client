import React, { useState } from "react";
import clsx from "clsx";
import {
  createStyles,
  lighten,
  makeStyles,
  Theme
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import FilterListIcon from "@material-ui/icons/FilterList";
import { APIConcept, QueryParams, SortableField } from "../types";
import { Link } from "react-router-dom";
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon
} from "@material-ui/icons";
import {
  Button,
  Input,
  InputAdornment,
  Menu,
  MenuItem
} from "@material-ui/core";

interface Props extends QueryParams {
  concepts: APIConcept[];
  buildUrl: Function;
  goTo: Function;
  count: number;
  toggleShowOptions: Function;
  q: string;
  setQ: Function;
  buttons?: { [key: string]: boolean };
  addConceptsToCollection: Function;
  linkedDictionary?: string;
  linkedSource?: string;
}

interface HeadCell {
  disablePadding: boolean;
  id: SortableField;
  label: string;
}

const headCells: HeadCell[] = [
  { id: "name", disablePadding: false, label: "Name" },
  { id: "conceptClass", disablePadding: false, label: "Class" },
  { id: "datatype", disablePadding: false, label: "Datatype" },
  { id: "id", disablePadding: false, label: "ID" }
];

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

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property: SortableField) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {numSelected <= 0 ? (
          ""
        ) : (
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

const useToolbarStyles = makeStyles((theme: Theme) =>
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

interface EnhancedTableToolbarProps {
  numSelected: number;
  toggleShowOptions: Function;
  search: Function;
  q: string;
  setQ: Function;
  showAddConcepts: boolean;
  addSelectedConcepts: Function;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const {
    numSelected,
    toggleShowOptions,
    search,
    q,
    setQ,
    showAddConcepts,
    addSelectedConcepts
  } = props;

  const classes = useToolbarStyles();

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle">
          <form
            onSubmit={e => {
              e.preventDefault();
              search(q);
            }}
          >
            <Input
              fullWidth
              placeholder="Search"
              value={q}
              onChange={e => setQ(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={() => search(q)}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
          </form>
        </Typography>
      )}
      {numSelected > 0 ? (
        <>
          {!showAddConcepts ? null : (
            <Tooltip title="Add">
              <IconButton onClick={e => addSelectedConcepts()} aria-label="add">
                <AddIcon />
              </IconButton>
            </Tooltip>
          )}
        </>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon onClick={() => toggleShowOptions()} />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      marginTop: theme.spacing(3)
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
    },
    buttonLink: {
      textDecoration: "none",
      color: "inherit"
    }
  })
);

const ConceptsTable: React.FC<Props> = ({
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
  collection,
  addConceptsToCollection,
  linkedDictionary,
  linkedSource,
}) => {
  const classes = useStyles();
  const [selected, setSelected] = React.useState<string[]>([]);
  const [menu, setMenu] = React.useState<{
    index: number;
    anchor: null | HTMLElement;
  }>({ index: -1, anchor: null });

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
      const newSelecteds = concepts.map(concept => concept.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const toggleSelect = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
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

  const isSelected = (id: string) => selected.includes(id);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          q={q}
          setQ={setQ}
          search={search}
          numSelected={selected.length}
          toggleShowOptions={toggleShowOptions}
          showAddConcepts={buttons.addToCollection}
          addSelectedConcepts={() =>
            addConceptsToCollection(
              concepts.filter(concept => selected.includes(concept.id))
            )
          }
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
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onDoubleClick={event => toggleSelect(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                  >
                    {selected.length <= 0 ? (
                      ""
                    ) : (
                      <TableCell padding="checkbox">
                        <Checkbox
                          onClick={event => toggleSelect(event, row.id)}
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      <Link onClick={e => e.stopPropagation()} to={`${row.version_url}${linkedDictionary ? `?linkedDictionary=${linkedDictionary}` : ''}`}>
                        {row.display_name}
                      </Link>
                    </TableCell>
                    <TableCell>{row.concept_class}</TableCell>
                    <TableCell>{row.datatype}</TableCell>
                    <TableCell>{row.id}</TableCell>
                    <TableCell padding="checkbox">
                      <IconButton
                        id={`${index}.menu-icon`}
                        aria-controls={`${index}.menu`}
                        aria-haspopup="true"
                        onClick={event => toggleMenu(index, event)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={menu.anchor}
                        id={`${index}.menu`}
                        open={index === menu.index}
                        onClose={() => toggleMenu(index)}
                      >
                        <MenuItem
                          onClick={event => {
                            toggleSelect(event, row.id);
                            toggleMenu(index);
                          }}
                        >
                          {isSelected(row.id) ? "Deselect" : "Select"}
                        </MenuItem>
                        {(!buttons.edit || !linkedSource || !row.url.includes(linkedSource)) ? null : (
                          <MenuItem onClick={() => toggleMenu(index)}>
                            <Link
                              className={classes.buttonLink}
                              to={`${row.version_url}edit/?linkedDictionary=${linkedDictionary}`}
                            >
                              Edit
                            </Link>
                          </MenuItem>
                        )}
                        {!buttons.addToCollection ? null : (
                          <MenuItem
                            onClick={() => {
                              if (addConceptsToCollection)
                                addConceptsToCollection([row]);
                              toggleMenu(index);
                            }}
                          >
                            Add
                          </MenuItem>
                        )}
                      </Menu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={count}
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
