import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../../components/Header";
import {
  DICTIONARY_CONTAINER,
  DICTIONARY_VERSION_CONTAINER,
  SOURCE_CONTAINER
} from "../constants";
import { getContainerIdFromUrl } from "../utils";
import { Button, Menu, MenuItem, TextField, Theme } from "@mui/material";
import { PREFERRED_SOURCES_VIEW_ONLY, useAnchor } from "../../../utils";
import { APISource } from "../../sources";
import { AccountTreeOutlined, FolderOpen } from "@mui/icons-material";
import { APIDictionary } from "../../dictionaries/types";
import { createStyles, makeStyles } from "@mui/styles";

interface Props {
  containerType: string;
  containerUrl?: string;
  gimmeAUrl: Function;
  addConceptToDictionary?: string;
  children?: React.ReactNode | React.ReactNode[];
  sources: APISource[];
  dictionaries: APIDictionary[];
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
      fill: "#8080809c",
      color:"#000000ad"
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
  dictionaries
}) => {
  const [showSources, setShowSources] = useState(false);
  const [preferredSources, setPreferredSources] = useState<
    { name: string; url: string }[]
  >();
  useEffect(() => {
    const defaultSources = Object.entries(
      PREFERRED_SOURCES_VIEW_ONLY
    ).map(([key, value]) => ({ name: key, url: value }));
    if (showSources) {
      const allSources = defaultSources
        .concat(sources.map(s => ({ name: s.name, url: s.url })))
        .concat(dictionaries.map(d => ({ name: d.name, url: d.url })));
      setPreferredSources(allSources);
    } else setPreferredSources(defaultSources);
  }, [showSources, sources, dictionaries]);

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
              showSources
                ? "Choose a source/dictionary"
                : "Select a different source/dictionary"
            }
            onClick={() => setShowSources(!showSources)}
          />
          {preferredSources?.map(({ name, url }) => (
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
          ))}
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
