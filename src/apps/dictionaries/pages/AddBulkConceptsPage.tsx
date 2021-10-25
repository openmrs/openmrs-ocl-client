import React, { useState } from "react";
import {
  Button,
  Grid,
  Menu,
  MenuItem,
  TextField,
  Theme,
  Typography
} from "@mui/material";
import { recursivelyAddConceptsToDictionaryAction } from "../redux";
import { useLocation } from "react-router";
import { connect } from "react-redux";
import { PREFERRED_SOURCES, useAnchor, useQueryParams } from "../../../utils";
import Header from "../../../components/Header";
import { Link } from "react-router-dom";
import { createStyles, makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonWrapper: {
      textAlign: "center",
      marginTop: "2vh"
    },
    lightColour: {
      color: theme.palette.background.default
    }
  })
);

interface Props {
  addConceptsToDictionary: (
    ...args: Parameters<typeof recursivelyAddConceptsToDictionaryAction>
  ) => void;
}

const AddBulkConceptsPage: React.FC<Props> = ({ addConceptsToDictionary }) => {
  const classes = useStyles();
  const { pathname: url } = useLocation();
  const { fromSource } = useQueryParams();

  const [
    switchSourceAnchor,
    handleSwitchSourceClick,
    handleSwitchSourceClose
  ] = useAnchor();

  const dictionaryUrl = url.replace("/add", "");
  const [conceptsToAdd, setConceptsToAdd] = useState<string[]>([]);

  return (
    <Header
      allowImplicitNavigation
      title={`Add concepts in bulk from ${fromSource}`}
      headerComponent={
        <>
          <Button
            className={classes.lightColour}
            variant="text"
            size="large"
            aria-haspopup="true"
            onClick={handleSwitchSourceClick}
          >
            Switch source (Currently {fromSource})
          </Button>
          <Menu
            anchorEl={switchSourceAnchor}
            keepMounted
            open={Boolean(switchSourceAnchor)}
            onClose={handleSwitchSourceClose}
          >
            {Object.entries(PREFERRED_SOURCES).map(
              ([sourceName, sourceUrl]) => (
                <MenuItem onClick={handleSwitchSourceClose}>
                  <Link
                    replace
                    className="link"
                    to={`${url}?fromSource=${sourceName}`}
                  >
                    {sourceName}
                  </Link>
                </MenuItem>
              )
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

const mapActionsToProps = {
  addConceptsToDictionary: recursivelyAddConceptsToDictionaryAction
};

export default connect(undefined, mapActionsToProps)(AddBulkConceptsPage);
