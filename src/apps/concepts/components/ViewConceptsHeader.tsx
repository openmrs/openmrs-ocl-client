import React from "react";
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
  Theme
} from "@material-ui/core";
import { PREFERRED_SOURCES_VIEW_ONLY, useAnchor } from "../../../utils";
import { APISource } from "../../sources";

interface Props {
  containerType: string;
  containerUrl?: string;
  gimmeAUrl: Function;
  addConceptToDictionary?: string;
  children?: React.ReactNode[];
  sources?:APISource[]
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    lightColour: {
      color: theme.palette.background.default
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
          anchorEl={switchSourceAnchor}
          keepMounted
          open={Boolean(switchSourceAnchor)}
          onClose={handleSwitchSourceClose}
        >
           {sources?.map(
            ({name, url}) => (
              <MenuItem
                // replace because we want to keep the back button useful
                replace
                to={gimmeAUrl({}, `${url}concepts/`)}
                key={name}
                component={Link}
                onClick={handleSwitchSourceClose}
                data-testid={name}
              >
                {name}
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
function SELECT_A_SOURCE_VIEW_ONLY(SELECT_A_SOURCE_VIEW_ONLY: any) {
  throw new Error("Function not implemented.");
}

