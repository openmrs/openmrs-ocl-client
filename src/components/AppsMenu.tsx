import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  IconButton,
  Tooltip,
  MenuItem,
  Box,
  Typography,
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
import { APIProfile } from "../apps/authentication";
import { getOCLURL } from "../utils";
import OpenMRSLogo from "./OpenMRSLogo";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "inline-flex"
    },
    menuItem: {
      display: "inline-block"
    },
    link: {
      color: "inherit",
      display: "inline-flex",
      alignItems: "center",
      textDecoration: "none"
    },
    box: {
      justifyContent: "space-around",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "90px",
      margin: "4px",
      borderRadius: "5px",
      padding: "10px"
    },
    text: {
      lineHeight: "1.2",
      marginTop: "15px",
      textAlign: "center",
      align: "center",
      component: "h6"
    },
    icon: {
      color: theme.palette.background.default
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
    <div className={classes.root}>
      <Tooltip title="Apps menu">
        <IconButton className={classes.icon} onClick={handleMenu}>
          <AppsIcon />
        </IconButton>
      </Tooltip>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorEl}
        role={undefined}
        transition
        disablePortal
        style={{ zIndex: 1 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: "right top"
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} id="menu-list-grow">
                  <MenuItem onClick={handleClose} className={classes.menuItem}>
                    <a href={getOCLURL()} className={classes.link}>
                      <Box className={classes.box}>
                        <Web fontSize="large" />
                        <Typography className={classes.text}>
                          OCL <br /> TermBrowser
                        </Typography>
                      </Box>
                    </a>
                  </MenuItem>
                  <MenuItem onClick={handleClose} className={classes.menuItem}>
                    <Link to="/" className={classes.link}>
                      <Box className={classes.box}>
                        <OpenMRSLogo />
                        <Typography className={classes.text}>
                          OpenMRS <br /> Dictionary <br /> Manager
                        </Typography>
                      </Box>
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleClose} className={classes.menuItem}>
                    <a
                      href={`${getOCLURL()}#/imports/`}
                      className={classes.link}
                    >
                      <Box className={classes.box}>
                        <ImportIcon fontSize="large" />
                        <Typography className={classes.text}>
                          Bulk <br /> Importer
                        </Typography>
                      </Box>
                    </a>
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
