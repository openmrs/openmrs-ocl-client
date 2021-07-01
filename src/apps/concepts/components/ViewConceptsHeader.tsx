import React, { useState } from "react";
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
  makeStyles,
  Menu,
  MenuItem,
  TextField,
  Theme
} from "@material-ui/core";
import {
  PREFERRED_SOURCES_VIEW_ONLY,
  useAnchor,
  VERIFIED_SOURCES
} from "../../../utils";
import { APISource } from "../../sources";
import { AccountTreeOutlined } from "@material-ui/icons";
import { VerifiedSource } from "../../../components/VerifiedSource";

interface Props {
  containerType: string;
  containerUrl?: string;
  gimmeAUrl: Function;
  addConceptToDictionary?: string;
  children?: React.ReactNode[];
  sources: APISource[];
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
    }
  })
);

const ViewConceptsHeader: React.FC<Props> = ({
  containerType,
  containerUrl,
  gimmeAUrl,
  addConceptToDictionary,
  children,
  sources
}) => {
  const [showSources, setShowSources] = useState(false);
  const formatPrefferedSources = Object.entries(
    PREFERRED_SOURCES_VIEW_ONLY
  ).map(([key, value]) => ({ name: key, url: value }));
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
          open={Boolean(switchSourceAnchor)}
          onClose={handleSwitchSourceClose}
        >
          <TextField
            multiline
            className={classes.textField}
            InputProps={{
              className: classes.underline
            }}
            inputProps={{
              className: classes.input
            }}
            value={
              showSources ? "Choose a source" : "Select a different source"
            }
            onClick={() => setShowSources(!showSources)}
          />
          {showSources
            ? formatPrefferedSources.concat(sources)?.map(({ name, url }) => (
                <MenuItem
                  // replace because we want to keep the back button useful
                  replace
                  to={gimmeAUrl({}, `${url}concepts/`)}
                  key={name}
                  component={Link}
                  onClick={handleSwitchSourceClose}
                  data-testid={name}
                >
                  <AccountTreeOutlined className={classes.sourceIcon} />
                  {name}
                </MenuItem>
              ))
            : Object.entries(PREFERRED_SOURCES_VIEW_ONLY).map(
                ([preferredSourceName, preferredSourceUrl]) => (
                  <MenuItem
                    // replace because we want to keep the back button useful
                    replace
                    to={gimmeAUrl({}, `${preferredSourceUrl}concepts/`)}
                    key={preferredSourceName}
                    component={Link}
                    onClick={handleSwitchSourceClose}
                    data-testid={preferredSourceName}
                  >
                    <AccountTreeOutlined className={classes.sourceIcon} />
                    {preferredSourceName}
                    {VERIFIED_SOURCES.includes(preferredSourceName) ? (
                      <VerifiedSource />
                    ) : (
                      ""
                    )}
                  </MenuItem>
                )
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
