import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import { connect } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
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
  GetApp
} from "@material-ui/icons";
import { recursivelyAddConceptsToDictionaryAction } from "../redux";
import { retrieveConceptsAction } from "../../concepts/redux";
import { PUBLIC_SOURCES_ACTION_INDEX } from "../../sources/redux/constants";
import {
  retrievePublicSourcesAction
} from "../../sources/redux";

import { PREFERRED_SOURCES, useAnchor, useQueryParams } from "../../../utils";
import Header from "../../../components/Header";
import { APISource } from "../../sources";
import { APIConcept } from "../../concepts";

import { AppState } from "../../../redux";
import { CSVLink } from "react-csv";

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
    downloadIcon: {
      color: "white"
    }
  })
);

interface Props {
  sources: APISource[];
  concepts?: APIConcept[];
  addConceptsToDictionary: (
    ...args: Parameters<typeof recursivelyAddConceptsToDictionaryAction>
  ) => void;
  retrievePublicSources: (
    ...args: Parameters<typeof retrievePublicSourcesAction>
  ) => void;
  retrieveConcepts: (
    ...args: Parameters<typeof retrieveConceptsAction>
  ) => void;
}

const AddBulkConceptsPage: React.FC<Props> = ({ addConceptsToDictionary, sources = [], retrievePublicSources, retrieveConcepts, concepts = [] }) => {
  const classes = useStyles();
  const { pathname: url } = useLocation();
  const { fromSource } = useQueryParams();

  const [showAllSources, setShowAllSources] = useState(false);

  const [queryString, setQueryString] = useState('');
  const handleSearch = (q: string) => setQueryString(q);

  const [currentSources, setCurrentSources] = useState<
    { name: string; sourceUrl: string }[]
  >();

  const defaultSources = Object.entries(
    PREFERRED_SOURCES
  ).map(([key, value]) => ({ name: key, sourceUrl: value }));

  const allSources = defaultSources.concat(sources.map(s => ({ name: s.name, sourceUrl: s.url })))

  const selectedSource = allSources?.find(s => s.name === fromSource);

  const conceptsUrl = `${selectedSource?.sourceUrl}concepts/`;

  console.log(conceptsUrl, 'curl');

  useEffect(() => {
    const defaultSources = Object.entries(
      PREFERRED_SOURCES
    ).map(([key, value]) => ({ name: key, sourceUrl: value }));
    if (showAllSources) {
      const allSources = defaultSources
        .concat(sources.map(s => ({ name: s.name, sourceUrl: s.url })))
      setCurrentSources(allSources);
    } else setCurrentSources(defaultSources);
  }, [showAllSources, sources]);

  const handleShowSources = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowAllSources(event.target.checked);
  };

  const sourceUrl = "/sources/";
  useEffect(() => {
    retrievePublicSources(sourceUrl, queryString);
  }, [retrievePublicSources, queryString]);

  useEffect(() => {
    if (selectedSource && fromSource) {
      retrieveConcepts({ conceptsUrl });
    }
  }, [fromSource]); // eslint-disable-line

  const [
    switchSourceAnchor,
    handleSwitchSourceClick,
    handleSwitchSourceClose
  ] = useAnchor();

  const dictionaryUrl = url.replace("/add", "");
  const [conceptsToAdd, setConceptsToAdd] = useState<string[]>([]);

  const csvHeaders = [
    { label: "Concept ID", key: "id" },
    { label: "Concept Type", key: "type" },
    { label: "Concept Class", key: "concept_class"},
    { label: "Name", key: "display_name" },
    { label: "Source", key: "source" }
  ];

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
          <Tooltip title={`Dowload Concepts for ${fromSource}`}>
            <CSVLink
              className={classes.csvLink}
              headers={csvHeaders}
              data={concepts}
              filename={`${fromSource}_concepts.csv`}
              enclosingCharacter={``}>
              <GetApp className={classes.downloadIcon} />
            </CSVLink>
          </Tooltip>
        </Button>
        <Menu
          PaperProps={{
            style: {
              marginTop: "30px",
              marginLeft: "10px"
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
            <InfiniteScroll
              dataLength={50} 
              next={() => {}}
              hasMore={true}
              loader={<h4>Loading...</h4>}
              endMessage={<h4>end</h4>}
              scrollableTarget="scrollableDiv"
            >
              {currentSources?.map(({ name, sourceUrl }) => (
                <MenuItem
                  // replace because we want to keep the back button useful
                  replace
                  to={`${url}?fromSource=${name}`}
                  key={name}
                  component={Link}
                  onClick={handleSwitchSourceClose}
                >
                  <AccountTreeOutlined className={classes.sourceIcon} />
                  {name}
                </MenuItem>
              ))}
            </InfiniteScroll>
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
    concepts: state.concepts.concepts
      ? state.concepts.concepts.items
      : undefined,
  };
};
const mapActionsToProps = {
  addConceptsToDictionary: recursivelyAddConceptsToDictionaryAction,
  retrievePublicSources: retrievePublicSourcesAction,
  retrieveConcepts: retrieveConceptsAction,
};

export default connect(mapStateToProps, mapActionsToProps)(AddBulkConceptsPage);
