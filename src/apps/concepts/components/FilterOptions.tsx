import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  Checkbox,
  createStyles,
  Input,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  makeStyles,
  Paper,
  Theme,
  Typography
} from "@material-ui/core";
import { CONCEPT_CLASSES, DATA_TYPES, CONCEPT_GENERAL } from "../../../utils";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      
    },
    paper: {
      width: "100%",
      marginBottom: theme.spacing(2),
      height: "85vh",
      overflowY: "auto"
    },
    center: {
      textAlign: "center"
    },
    listSubHeader: {
      backgroundColor: "white" // todo hard coded colour
    },
    applyFilters: {
      marginTop: "2vh",
      marginBottom: "2vh"
    },
    applyFiltersLink: {
      textDecoration: "none",
      color: "inherit"
    },
    listItem: {
      paddingTop: "0",
      paddingBottom: "0"
    },
    listItemText: {
      marginTop: "0",
      marginBottom: "0"
    }
  })
);

interface FilterGroupProps {
  items: string[];
  title: string;
  searchText: string;
  checked: string[];
  setChecked: Function;
}

const FilterGroup: React.FC<FilterGroupProps> = ({
  items,
  title,
  searchText,
  checked,
  setChecked
}) => {
  const classes = useStyles();

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const itemsToDisplay = items.filter(item =>
    item.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <List
        disablePadding
        subheader={
          <ListSubheader className={classes.listSubHeader} component="div">
            {title}
          </ListSubheader>
        }
      >
        {itemsToDisplay.map(value => {
          const id = `checkbox-${title}-${value}`;

          return (
            <ListItem
              key={value}
              role={undefined}
              dense
              button
              className={classes.listItem}
            >
              <ListItemIcon>
                <Checkbox
                  id={id}
                  edge="start"
                  onChange={handleToggle(value)}
                  checked={checked.includes(value)}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText
                className={classes.listItemText}
                primary={<label htmlFor={id}>{value}</label>}
              />
            </ListItem>
          );
        })}
        {itemsToDisplay.length ? null : (
          <Typography color="textSecondary" align="center">
            None matching this filter
          </Typography>
        )}
      </List>
    </>
  );
};

interface FilterOptionsProps {
  url: string;
  checkedClasses: string[];
  setCheckedClasses: Function;
  checkedDataTypes: string[];
  setCheckedDataTypes: Function;
  checkedGeneral: string[];
  setCheckedGeneral: Function;
  checkedSources: string[];
  setCheckedSources: Function;
  sourceOptions: string[];
  showSources?: boolean;
}

const FilterOptions: React.FC<FilterOptionsProps> = ({
  url,
  checkedClasses,
  checkedDataTypes,
  checkedGeneral,
  checkedSources,
  setCheckedClasses,
  setCheckedDataTypes,
  setCheckedGeneral,
  setCheckedSources,
  sourceOptions,
  showSources = true
}) => {
  const classes = useStyles();
  const [searchText, setSearchText] = useState("");

  const clearAllFilters = () => {
    setCheckedClasses([]);
    setCheckedDataTypes([]);
    setCheckedGeneral([]);
    setCheckedSources([]);
  };

  return (
    <div data-testid="filterOptions" className={classes.root}>
      <Paper className={classes.paper}>
        <div className={classes.center}>
          <ButtonGroup size="small" variant="text" fullWidth>
            <Button className={classes.applyFilters} color="primary">
              <Link replace className={classes.applyFiltersLink} to={url}>
                Apply Filters
              </Link>
            </Button>
            <Button
              onClick={clearAllFilters}
              className={classes.applyFilters}
              color="primary"
            >
              Clear all
            </Button>
          </ButtonGroup>
          <Input
            placeholder="Search filters"
            type="search"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        </div>
        {showSources ? (
          <FilterGroup
            checked={checkedSources}
            setChecked={setCheckedSources}
            searchText={searchText}
            title="Sources"
            items={sourceOptions}
          />
        ) : null}
        <FilterGroup
          checked={checkedClasses}
          setChecked={setCheckedClasses}
          searchText={searchText}
          title="Classes"
          items={CONCEPT_CLASSES}
        />
        <FilterGroup
          checked={checkedDataTypes}
          setChecked={setCheckedDataTypes}
          searchText={searchText}
          title="Data types"
          items={DATA_TYPES}
        />
        <FilterGroup
          checked={checkedGeneral}
          setChecked={setCheckedGeneral}
          searchText={searchText}
          title="General"
          items={CONCEPT_GENERAL}
        />
      </Paper>
    </div>
  );
};

export default FilterOptions;
