import React from "react";
import clsx from "clsx";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FilterListIcon from "@material-ui/icons/FilterList";
import { Add as AddIcon, Search as SearchIcon } from "@material-ui/icons";
import { Input, InputAdornment } from "@material-ui/core";
import { useToolbarStyles } from "./ConceptsTable";

interface EnhancedTableToolbarProps {
  numSelected: number;
  toggleShowOptions: Function;
  search: Function;
  q: string;
  setQ: Function;
  showAddConcepts: boolean;
  addSelectedConcepts: Function;
}
export const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
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
              placeholder="Search concepts"
              type="search"
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
            <Tooltip title="Add selected to dictionary">
              <IconButton onClick={e => addSelectedConcepts()} aria-label="add">
                <AddIcon />
              </IconButton>
            </Tooltip>
          )}
        </>
      ) : (
        <Tooltip title="Filter list">
          <IconButton
            aria-label="filter list"
            onClick={() => toggleShowOptions()}
          >
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};
