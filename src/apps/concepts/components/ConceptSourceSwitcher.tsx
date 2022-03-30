import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DICTIONARY_VERSION_CONTAINER, SOURCE_CONTAINER } from "../constants";
import { getContainerIdFromUrl } from "../utils";
import {
  Button,
  FormControlLabel,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  Menu,
  MenuItem,
  Switch,
  Theme
} from "@mui/material";
import { PREFERRED_SOURCES_VIEW_ONLY, useAnchor } from "../../../utils";
import { APISource } from "../../sources";
import {
  AccountTreeOutlined,
  FolderOpen,
  Search as SearchIcon
} from "@mui/icons-material";
import { APIDictionary } from "../../dictionaries/types";
import { createStyles, makeStyles } from "@mui/styles";
import InfiniteScroll from "react-infinite-scroll-component";
import { partialRight, pick } from "lodash";
import dictionaryApi from "../../dictionaries/api";
import sourceApi from "../../sources/api";

interface Props {
  containerType: string;
  containerUrl?: string;
  gimmeAUrl: Function;
  addConceptToDictionary?: string;
  sources: APISource[];
  dictionaries: APIDictionary[];
  showOnlyVerified: boolean;
  toggleShowVerified: React.ChangeEventHandler<HTMLInputElement>;
  goTo: Function;
  initialSearch: string;
  pathUrl: Function;
  dictionaryMeta?: {
    num_found?: number;
    page_number?: number;
    pages?: number;
    num_returned?: number;
  };
  sourcesMeta?: {
    num_found?: number;
    page_number?: number;
    pages?: number;
    num_returned?: number;
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    lightColour: {
      color: "white !important"
    },
    textField: {
      padding: "0.2rem 1rem",
      cursor: "none"
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
    }
  })
);
const ConceptSourceSwitcher: React.FC<Props> = ({
  containerType,
  containerUrl,
  gimmeAUrl,
  addConceptToDictionary,
  sources,
  dictionaries,
  goTo,
  initialSearch,
  pathUrl
}) => {
  const [queryString, setQueryString] = useState(initialSearch);
  const [currentSources, setCurrentSources] = useState<
    { name: string; url: string }[]
  >();
  const [useSources, setUseSources] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [apiMethod, setApiMethod] = useState<
    | typeof sourceApi.sources.retrieve.private
    | typeof dictionaryApi.dictionaries.retrieve.private
  >(sourceApi.sources.retrieve.private);
  const [totalResultCount, setTotalResultCount] = useState(0);
  const [currentResultCount, setCurrentResultCount] = useState(0);
  const [resultsLoadedCount, setResultsLoadedCount] = useState(0);

  useEffect(() => {
    const defaultSources = Object.entries(
      PREFERRED_SOURCES_VIEW_ONLY
    ).map(([key, value]) => ({ name: key, url: value }));
    const allSources = defaultSources
      .concat(sources.map((s) => ({ name: s.name, url: s.url })))
      .concat(dictionaries.map((d) => ({ name: d.name, url: d.url })));
    setCurrentSources(allSources);
  }, [sources, dictionaries, initialSearch]);

  useEffect(() => setCurrentPage(0), [useSources]);
  useEffect(
    () =>
      useSources
        ? setApiMethod(sourceApi.sources.retrieve.private)
        : setApiMethod(dictionaryApi.dictionaries.retrieve.private),
    [useSources]
  );

  useEffect(() => {
    const url = useSources ? "/sources/" : "/collections/";

    apiMethod(url, undefined, 25, currentPage).then((results) => {
      const sources = results.data.map(partialRight(pick, "name", "url")) as {
        name: string;
        url: string;
      }[];

      if (currentPage === 1) {
        setTotalResultCount(results.headers.num_found);
      }

      setCurrentResultCount(results.headers.num_returned);
      setResultsLoadedCount(
        results.headers.offset + results.headers.num_returned
      );

      const existingSources = currentSources ? currentSources : [];
      setCurrentSources([...existingSources, ...sources]);
    });
  }, [apiMethod, currentPage, currentSources, useSources]);

  const loadData = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleSearch = (q: string) => goTo(pathUrl({ q }));

  const classes = useStyles();
  const isSourceContainer = containerType === SOURCE_CONTAINER;
  const isAddToDictionary = isSourceContainer && !!addConceptToDictionary;
  const [
    switchSourceAnchor,
    handleSwitchSourceClick,
    handleSwitchSourceClose
  ] = useAnchor();

  return !isAddToDictionary ? null : (
    <>
      <Button
        data-testid="switch-source"
        className={classes.lightColour}
        variant="text"
        size="large"
        aria-haspopup="true"
        onClick={handleSwitchSourceClick}
      >
        Switch source (Currently {getContainerIdFromUrl(containerUrl)})
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
          className={classes.sourcesDropdownHeader}
        >
          <FormControlLabel
            control={
              <Switch
                checked={useSources}
                onChange={() => setUseSources(!useSources)}
                color="primary"
                name="displayVerified"
              />
            }
            label={useSources ? `Showing all Sources` : `Show all Dictionaries`}
          />
          <form
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
              onChange={(e) => setQueryString(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={() => handleSearch(queryString)}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
          </form>
        </Grid>
        <InfiniteScroll
          dataLength={currentResultCount}
          next={loadData}
          hasMore={resultsLoadedCount < totalResultCount}
          loader={<h4>Loading...</h4>}
          endMessage={<h4>end</h4>}
          scrollableTarget="scrollableDiv"
        >
          {currentSources?.map(({ name, url }) => (
            <MenuItem
              // replace because we want to keep the back button useful
              replace
              to={gimmeAUrl({}, `${url}concepts/`)}
              key={name}
              component={Link}
              onClick={handleSwitchSourceClose}
            >
              {url?.includes("/collection") ? (
                <FolderOpen className={classes.sourceIcon} />
              ) : (
                <AccountTreeOutlined className={classes.sourceIcon} />
              )}
              {name}
            </MenuItem>
          ))}
        </InfiniteScroll>
      </Menu>
    </>
  );
};

export default ConceptSourceSwitcher;
