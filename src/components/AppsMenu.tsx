import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  IconButton,
  MenuItem,
  Box,
  Grow,
  Paper,
  Popper,
  MenuList,
  ClickAwayListener
} from "@material-ui/core";
import { Link } from "react-router-dom";
import {
  Apps as AppsIcon,
  Web,
  Publish as ImportIcon
} from "@material-ui/icons";
import { getOCLURL } from "../utils";
import OpenMRSLogo from "./OpenMRSLogo";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      color: "inherit",
      display: "inline-flex",
      alignItems: "center",
      textDecoration: "none"
    },
    box: {
      alignContent:"center",
      align: "center",
      textAlign: "center",

    },
    icon: {
      marginLeft:"-10px"
    },
    paper:{
      marginLeft: "50px"
    }
  })
);

export const AppsMenu: React.FC = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
        <IconButton onClick={handleMenu} className={classes.icon}>
          <AppsIcon />
        </IconButton>
      <Popper
        placement="right-start"
        open={open}
        anchorEl={anchorEl}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
          >
            <Paper className={classes.paper}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} id="menu-list-grow">
                  <MenuItem onClick={handleClose}>
                    <Link
                      to={getOCLURL()}
                      className={classes.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Box className={classes.box}>
                        <Web fontSize="small" />  OCL TermBrowser
                      </Box>
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <Link
                      to="/"
                      className={classes.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Box className={classes.box}>
                        <OpenMRSLogo />   OpenMRS Dictionary Manager
                      </Box>
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <Link to={`${getOCLURL()}#/imports/`}
                      className={classes.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Box className={classes.box}>
                        <ImportIcon />  Bulk Importer
                      </Box>
                    </Link>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};
