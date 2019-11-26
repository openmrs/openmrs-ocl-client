import React, { useState } from 'react'
import {
  Checkbox,
  createStyles,
  List,
  ListItem,
  ListItemIcon, ListItemText,
  makeStyles,
  Paper,
  Input,
  Theme,
  ListSubheader,
  Button, ButtonGroup,
} from '@material-ui/core'
import { DATA_TYPES, CONCEPT_CLASSES } from '../../../utils'
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(3),
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
      height: '85vh',
      overflowY: 'auto',
    },
    center: {
      textAlign: 'center',
    },
    listSubHeader: {
      backgroundColor: 'white',
    },
    applyFilters: {
      marginTop: '2vh',
      marginBottom: '2vh',
    },
    applyFiltersLink: {
      textDecoration: 'none',
    },
  }),
);

interface FilterGroupProps {
  items: string[],
  title: string,
  searchText: string,
  checked: string[],
  setChecked: Function,
}

const FilterGroup: React.FC<FilterGroupProps> = ({items, title, searchText, checked, setChecked}) => {
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

  return (
    <>
      <List
        subheader={
          <ListSubheader className={classes.listSubHeader} component="div">
            {title}
          </ListSubheader>
        }
      >
        {items.filter(item => item.toLowerCase().indexOf(searchText.toLowerCase()) >= 0).map(value => {
          const labelId = `checkbox-list-label-${value}`;

          return (
            <ListItem key={value} role={undefined} dense button onClick={handleToggle(value)}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value} />
            </ListItem>
          );
        })}
      </List>
    </>
  )
};

interface FilterOptionsProps {
  url: string,
  checkedClasses: string[],
  setCheckedClasses: Function,
  checkedDataTypes: string[],
  setCheckedDataTypes: Function,
}

const FilterOptions: React.FC<FilterOptionsProps> = ({url, checkedClasses, checkedDataTypes, setCheckedClasses, setCheckedDataTypes}) => {
  const classes = useStyles();
  const [searchText, setSearchText] = useState('');

  const clearAllFilters = () => {
    setCheckedClasses([]);
    setCheckedDataTypes([]);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <div className={classes.center}>
          <ButtonGroup variant="text" fullWidth>
            <Button className={classes.applyFilters} variant="text" color='primary'>
              <Link className={classes.applyFiltersLink} to={url}>Apply Filters</Link>
            </Button>
            <Button onClick={clearAllFilters} className={classes.applyFilters} variant="text" color='primary'>Clear all</Button>
          </ButtonGroup>
          <Input
            placeholder='Search'
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <FilterGroup checked={checkedClasses} setChecked={setCheckedClasses} searchText={searchText} title="Classes" items={CONCEPT_CLASSES}/>
        <FilterGroup checked={checkedDataTypes} setChecked={setCheckedDataTypes} searchText={searchText} title="Data types" items={DATA_TYPES}/>
      </Paper>
    </div>
  )
};

export default FilterOptions;
