import React from "react";
import { createStyles, makeStyles } from "@mui/styles";
import {
  MenuItem,
  Box,
  Grow,
  Paper,
  Popper,
  MenuList,
  ClickAwayListener,
  Link,
  Theme
} from "@mui/material";
import {
  Web,
  Publish as ImportIcon,
  Apps as AppsIcon
} from "@mui/icons-material";
import { OCL_URL } from "../utils";
import { ReactComponent as OmrsLogo } from "./omrs-logo.svg";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      marginLeft: "10px"
    },
    popperWithOpenNav: {
      display: "block",
      left: "210px !important"
    }
  })
);

interface Props {
  handleClose: () => void;
  open: boolean;
}

export const AppsMenu: React.FC<Props> = ({ handleClose, open }) => {
  const classes = useStyles();

  const anchorRef = React.useRef(null);

  return (
    <div>
      <AppsIcon ref={anchorRef} />
      <Popper
        className={classes.popperWithOpenNav}
        placement="right-start"
        open={open}
        role={undefined}
        transition
        disablePortal
        anchorEl={anchorRef.current}
      >
        {({ TransitionProps, placement }) => (
          <Grow {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} id="menu-list-grow">
                  <MenuItem onClick={handleClose}>
                    <Link
                      href={OCL_URL}
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
                        <OmrsLogo height={24} width={24} /> OpenMRS Dictionary
                        Manager
                      </Box>
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <Link
                      href={OCL_URL + "imports"}
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
    </div>
  );
};
