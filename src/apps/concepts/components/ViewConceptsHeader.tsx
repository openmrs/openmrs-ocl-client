import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../../components/Header";
import {
  DICTIONARY_CONTAINER,
  DICTIONARY_VERSION_CONTAINER,
  SOURCE_CONTAINER
} from "../constants";
import { getContainerIdFromUrl } from "../utils";
import {
  Button,
  createStyles,
  FormControlLabel,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  makeStyles,
  Menu,
  MenuItem,
  Switch,
  Theme
} from "@material-ui/core";
import { PREFERRED_SOURCES_VIEW_ONLY, useAnchor } from "../../../utils";
import { APISource } from "../../sources";
import {
  AccountTreeOutlined,
  FolderOpen,
  Search as SearchIcon
} from "@material-ui/icons";
import { APIDictionary } from '../../dictionaries/types';
import { VerifiedSource } from "../../../components/VerifiedSource";
import InfiniteScroll from "react-infinite-scroll-component";
import api from '../../organisations/api';
interface Props {
  containerType: string;
  containerUrl?: string;
  gimmeAUrl: Function;
  addConceptToDictionary?: string;
  children?: React.ReactNode[];
  sources: APISource[];
  dictionaries: APIDictionary[];
  showOnlyVerified: boolean;
  toggleShowVerified: React.ChangeEventHandler<HTMLInputElement>;
  goTo: Function;
  initialSearch: string;
  pathUrl: Function;
  dictionaryMeta?: { num_found?: number, page_number?:number,pages?:number };
  sourcesMeta?: { num_found?: number, page_number?:number,pages?:number };
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    lightColour: {
      color: theme.palette.background.default
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
const ViewConceptsHeader: React.FC<Props> = ({
  containerType,
  containerUrl,
  gimmeAUrl,
  addConceptToDictionary,
  children,
  sources,
  dictionaries,
  goTo,
  initialSearch,
  pathUrl,
  dictionaryMeta,
  sourcesMeta
}) => {
  const [showAllSources, setShowAllSources] = useState(false);
  const [queryString, setQueryString] = useState(initialSearch);
  const [currentSources, setCurrentSources] = useState<
    { name: string; url: string }[]
  >();
  useEffect(() => {
    const defaultSources = Object.entries(
      PREFERRED_SOURCES_VIEW_ONLY
    ).map(([key, value]) => ({ name: key, url: value }));
    if (showAllSources) {
      const allSources = defaultSources
        .concat(sources.map(s => ({ name: s.name, url: s.url })))
        .concat(dictionaries.map(d => ({ name: d.name, url: d.url })));
      setCurrentSources(allSources);
    } else setCurrentSources(defaultSources);
  }, [showAllSources, sources, dictionaries, initialSearch]);
  // const hasMoreData = () => {
  //   return currentPage === totalPages;
  // }
  // // TODO - Check if this is correct
  const fetchMoreData = () => {
  //   const results = api.dictionaries.retrieve.public(page = currentPage + 1)
  //   setCurrentSources([].concat(currentSources, results));
   };
  const handleSearch = (q: string) => goTo(pathUrl({ q }));
  const handleShowSources = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowAllSources(event.target.checked);
  };
  const classes = useStyles();
  const isSourceContainer = containerType === SOURCE_CONTAINER;
  const isAddToDictionary = isSourceContainer && !!addConceptToDictionary;
  const [
    switchSourceAnchor,
    handleSwitchSourceClick,
    handleSwitchSourceClose
  ] = useAnchor();
  const getTitleBasedOnContainerType = () => {
    return isAddToDictionary
      ? `Import existing concept from ${getContainerIdFromUrl(containerUrl)}`
      : `Concepts in ${
          containerType === DICTIONARY_VERSION_CONTAINER ? "v" : ""
        }${getContainerIdFromUrl(containerUrl)}`;
  };
  const dictionaryObj = dictionaryMeta ? dictionaryMeta:{};
  const dictionaryCount = dictionaryObj.num_found ? dictionaryObj.num_found:0;
  const dictionaryPageNumber = dictionaryObj.page_number ? dictionaryObj.page_number:0;
  const dictionaryPages = dictionaryObj.pages ? dictionaryObj.pages:0;
  
  const sourceObj = sourcesMeta ? sourcesMeta:{};
  const sourcesCount = sourceObj.num_found ? sourceObj.num_found:0;
  const sourcesPageNumber = sourceObj.page_number ? sourceObj.page_number:0;
  const sourcesPages = sourceObj.pages ? sourceObj.pages:0;
  const totalCount = sourcesCount + dictionaryCount

  const showSwitchSourceBasedOnContainerType = () => {
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
              dataLength={totalCount} 
              next={fetchMoreData}
              hasMore={true}
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
          ) : (
            currentSources?.map(({ name, url }) => (
              <MenuItem
                // replace because we want to keep the back button useful
                replace
                to={gimmeAUrl({}, `${url}concepts/`)}
                key={name}
                component={Link}
                onClick={handleSwitchSourceClose}
                data-testid={name}
              >
                {url?.includes("/collection") ? (
                  <FolderOpen className={classes.sourceIcon} />
                ) : (
                  <AccountTreeOutlined className={classes.sourceIcon} />
                )}
                {name}
              </MenuItem>
            ))
          )}
        </Menu>
      </>
    );
  };
  return (
    <Header
      title={getTitleBasedOnContainerType()}
      headerComponent={showSwitchSourceBasedOnContainerType()}
      // we can only be confident about the back url when viewing a collection's concepts
      allowImplicitNavigation
      backUrl={
        containerType !== DICTIONARY_CONTAINER ? undefined : containerUrl
      }
      backText={
        containerType === SOURCE_CONTAINER ? undefined : "Back to dictionary"
      }
    >
      {children}
    </Header>
  );
};
export default ViewConceptsHeader;
