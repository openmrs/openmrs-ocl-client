import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  MenuItem,
  Box,
  Grow,
  Paper,
  Popper,
  MenuList,
  ClickAwayListener,
  Link
} from "@material-ui/core";
import { Web, Publish as ImportIcon } from "@material-ui/icons";
import { getOCLURL } from "../utils";
import OpenMRSLogo from "./OpenMRSLogo";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      alignContent: "center",
      align: "center",
      textAlign: "center"
    },
    icon: {
      marginLeft: "-10px"
    },
    paper: {
      marginLeft: "50px"
    },
    popperWithOpenNav: {
      display: "block",
      position: "absolute!important" as "absolute",
      top: "245px !important",
      left: "210px !important"
    },
    popper: {
      display: "block",
      position: "absolute!important" as "absolute",
      top: "245px !important",
      left: "25px !important"
    }
  })
);

interface Props {
  open: boolean;
  navOpen?: boolean;
}

export const AppsMenu: React.FC<Props> = ({ open, navOpen }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Popper
      className={navOpen ? classes.popperWithOpenNav : classes.popper}
      placement="right-start"
      open={open}
      anchorEl={anchorEl}
      role={undefined}
      transition
      disablePortal
    >
      {({ TransitionProps, placement }) => (
        <Grow {...TransitionProps}>
          <Paper className={classes.paper}>
            <ClickAwayListener onClickAway={handleClose}>
              <MenuList autoFocusItem={open} id="menu-list-grow">
                <MenuItem onClick={handleClose}>
                  <Link
                    href={getOCLURL()}
                    underline="none"
                    color={"inherit"}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Box className={classes.box}>
                      <Web fontSize="small" /> OCL TermBrowser
                    </Box>
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link
                    href="/"
                    underline="none"
                    color={"inherit"}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Box className={classes.box}>
                      <OpenMRSLogo /> OpenMRS Dictionary Manager
                    </Box>
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link
                    href={`${getOCLURL()}#/imports/`}
                    underline="none"
                    color={"inherit"}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Box className={classes.box}>
                      <ImportIcon /> Bulk Importer
                    </Box>
                  </Link>
                </MenuItem>
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};

