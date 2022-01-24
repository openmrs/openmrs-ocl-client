import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import { connect } from "react-redux";
import {
  Button,
  createStyles,
  Grid,
  makeStyles,
  Menu,
  MenuItem,
  TextField,
  Theme,
  Typography,
  FormControlLabel,
  Switch,
  Input,
  InputAdornment,
  IconButton,
  Tooltip
} from "@material-ui/core";
import {
  AccountTreeOutlined,
  Search as SearchIcon,
  OpenInNew
} from "@material-ui/icons";
import { recursivelyAddConceptsToDictionaryAction } from "../redux";
import { PUBLIC_SOURCES_ACTION_INDEX } from "../../sources/redux/constants";
import {
  retrievePublicSourcesAction
} from "../../sources/redux";

import { PREFERRED_SOURCES, useAnchor, useQueryParams } from "../../../utils";
import Header from "../../../components/Header";
import { APISource } from "../../sources";
import { AppState } from "../../../redux";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonWrapper: {
      textAlign: "center",
      marginTop: "2vh"
    },
    lightColour: {
      color: theme.palette.background.default
    },
    sourcesDropdownHeader: {
      padding: "0.5rem 1rem"
    },
    input: {
      cursor: "pointer",
      borderBottom: "1px dotted black",
      paddingBottom: "0.25rem"
    },
    underline: {
      "&&&:before": {
        borderBottom: "none"
      },
      "&&:after": {
        borderBottom: "none"
      }
    },
    sourceIcon: {
      marginRight: "0.2rem",
      fill: "#8080809c"
    },
    searchInput: {
      textAlign: "center",
      fontSize: "larger"
    },
    csvLink: {
      marginTop: "0.5rem"
    },
    newPageIcon: {
      color: "white",
      marginTop: "0.5rem",
      width: "1rem",
      height: "1rem"
    },
    loadMoreButton: {
      margin: "auto",
      display: "flex",
      border: "none",
      fontWeight: "bold",
      marginTop: "1rem",
      marginBottom: "1rem"
    },
    seenAllText: {
      margin: "auto",
      fontWeight: "bold",
      marginTop: "1rem",
      marginBottom: "1rem",
      textAlign: "center"
    }
  })
);

interface Props {
  sources: APISource[];
  meta?: { num_found?: number };
  addConceptsToDictionary: (
    ...args: Parameters<typeof recursivelyAddConceptsToDictionaryAction>
  ) => void;
  retrievePublicSources: (
    ...args: Parameters<typeof retrievePublicSourcesAction>
  ) => Promise<any>;
}

const AddBulkConceptsPage: React.FC<Props> = ({ addConceptsToDictionary, sources = [], retrievePublicSources, meta = {} }) => {
  const classes = useStyles();
  const { pathname: url } = useLocation();
  const { fromSource } = useQueryParams();

  const [showAllSources, setShowAllSources] = useState(false);

  const [queryString, setQueryString] = useState('');
  const handleSearch = (q: string) => setQueryString(q);

  const [currentSources, setCurrentSources] = useState<
    { name: string; sourceUrl: string }[]
  >([]);

  const defaultSources = Object.entries(
    PREFERRED_SOURCES
  ).map(([key, value]) => ({ name: key, sourceUrl: value }));

  const allSources = defaultSources.concat(sources.map(s => ({ name: s.name, sourceUrl: s.url })))

  const selectedSource = allSources?.find(s => s.name === fromSource);

  const conceptsUrl = `${selectedSource?.sourceUrl}concepts/`;

  const [page, setPage] = useState<number>(1);
  const [paginating, setPaginating] = useState(false);
  
  const { num_found: numberFound = sources.length } = meta;

  const sourceUrl = "/sources/";
  const limit = 20;

  const loadSourcesList = () => {
    setPaginating(true);
    setPage(page+1);
    retrievePublicSources(sourceUrl, queryString, limit, page)
      .then((res) => {
        const newList = currentSources?.length  ? [...currentSources, ...res.map((s: any) => ({ name: s.name, sourceUrl: s.url }))] : [...res.map((s: any) => ({ name: s.name, sourceUrl: s.url }))];
        setCurrentSources(newList);
      })
      .catch((err) => {
        console.log(err);
      })
  };

  useEffect(() => {
    const defaultSources = Object.entries(
      PREFERRED_SOURCES
    ).map(([key, value]) => ({ name: key, sourceUrl: value }));
    if (showAllSources && !paginating) {
      const allSources = defaultSources
        .concat(sources.map(s => ({ name: s.name, sourceUrl: s.url })))
      setCurrentSources(allSources);
    } else if (!showAllSources) {
      setCurrentSources(defaultSources)
    }
  }, [showAllSources, sources]); // eslint-disable-line

  const handleShowSources = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowAllSources(event.target.checked);
  };
  
  useEffect(() => {
    retrievePublicSources(sourceUrl, queryString);
  }, [retrievePublicSources, queryString]);

  const [
    switchSourceAnchor,
    handleSwitchSourceClick,
    handleSwitchSourceClose
  ] = useAnchor();

  const dictionaryUrl = url.replace("/add", "");
  const [conceptsToAdd, setConceptsToAdd] = useState<string[]>([]);
  const hasMoreSources = numberFound > currentSources?.length;

  return (
    <Header
      allowImplicitNavigation
      title={`Add concepts in bulk from ${fromSource}`}
      headerComponent={
        <>
        <Button
          data-testid="switch-source"
          className={classes.lightColour}
          variant="text"
          size="large"
          aria-haspopup="true"
          onClick={handleSwitchSourceClick}
        >
          Switch source (Currently {fromSource})
        </Button>
        <Tooltip title={`Browser to view All Concepts in ${fromSource}`}>
          <Link to={conceptsUrl} target="_blank" rel="noopener noreferrer">
            <OpenInNew className={classes.newPageIcon} />
          </Link>
        </Tooltip>
        <Menu
          PaperProps={{
            style: {
              marginTop: "30px",
              marginLeft: "10px",
              minWidth: "20rem"
            }
          }}
          anchorEl={switchSourceAnchor}
          keepMounted
          open={!!switchSourceAnchor}
          onClose={handleSwitchSourceClose}
        >
          <Grid 
          container 
          direction="column" 
          className={classes.sourcesDropdownHeader}>
            <FormControlLabel
              control={
                <Switch
                  checked={showAllSources}
                  onChange={handleShowSources}
                  color="primary"
                  name="displayVerified"
                />
              }
              label={
                showAllSources
                  ? `Showing all Sources`
                  : `Show all Sources`
              }
            />
            {showAllSources && <form
              onSubmit={(e: React.SyntheticEvent) => {
                e.preventDefault();
                handleSearch(queryString);
              }}
            >
              <Input
                color="primary"
                type="search"
                fullWidth
                placeholder={"Select an alternative source"}
                value={queryString}
                onChange={e => setQueryString(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleSearch(queryString)}>
                      <SearchIcon/>
                    </IconButton>
                  </InputAdornment>
                }
              />
            </form>}
          </Grid>
          {showAllSources ? (
            <div className="">
              {currentSources?.map(({ name, sourceUrl }, i) => (
                <MenuItem
                  // replace because we want to keep the back button useful
                  replace
                  to={`${url}?fromSource=${name}`}
                  key={name+i}
                  component={Link}
                  onClick={handleSwitchSourceClose}
                >
                  <AccountTreeOutlined className={classes.sourceIcon} />
                  {name}
                </MenuItem>
              ))
              }
            {hasMoreSources ? <button onMouseEnter={() => loadSourcesList()} className={classes.loadMoreButton}>Load More Sources ...</button> : <div className={classes.seenAllText}>Yay! You have seen all {numberFound} Sources...</div>}
            </div>
          ) : (
            currentSources?.map(({ name, sourceUrl }) => (
              <MenuItem
                replace
                to={`${url}?fromSource=${name}`}
                key={name}
                component={Link}
                onClick={handleSwitchSourceClose}
                data-testid={name}>
                <AccountTreeOutlined className={classes.sourceIcon} />
                {name}
              </MenuItem>
            ))
          )}
        </Menu>
      </>
      }
    >
      <Grid item xs={6}>
        <Typography align="center">
          Please provide IDs for the {fromSource} concepts to add. IDs should be
          separated with a space, comma or new lines. For example, you can copy
          and paste from a spreadsheet column. e.g 1000, 1001, 1002.
        </Typography>
        <br />
        <TextField
          placeholder="1000, 1001, 1002, 1003, 1004, 1005, 1006, 1007"
          onChange={e => setConceptsToAdd(e.target.value.split(/[\s,\r\n]+/))}
          fullWidth
          multiline
          rows={20}
          variant="outlined"
        />
        <br />
        <div className={classes.buttonWrapper}>
          <Button
            to={{ pathname: `/actions` }}
            component={Link}
            variant="outlined"
            color="primary"
            size="medium"
            disabled={conceptsToAdd.length < 1}
            onClick={() => {
              setConceptsToAdd([]);
              addConceptsToDictionary(
                dictionaryUrl,
                conceptsToAdd,
                true,
                PREFERRED_SOURCES[fromSource]
              );
            }}
          >
            Add concepts
          </Button>
        </div>
      </Grid>
    </Header>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    sources: state.sources.sources[PUBLIC_SOURCES_ACTION_INDEX]?.items,
    meta: state.sources.sources[PUBLIC_SOURCES_ACTION_INDEX]?.responseMeta
  };
};
const mapActionsToProps = {
  addConceptsToDictionary: recursivelyAddConceptsToDictionaryAction,
  retrievePublicSources: retrievePublicSourcesAction
};

export default connect(mapStateToProps, mapActionsToProps)(AddBulkConceptsPage);
