import React from "react";
import clsx from "clsx";
import {Toolbar, Typography,IconButton,Tooltip,InputAdornment,Input}from "@mui/material";
import { Add as AddIcon, Search as SearchIcon ,FilterList as FilterListIcon} from "@mui/icons-material";
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
          {showAddConcepts ? null : (
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
