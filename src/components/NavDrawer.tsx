import React from "react";
import clsx from "clsx";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {
  ExitToApp,
  FolderOpenOutlined,
  People,
  AccountTreeOutlined,
  Notifications as NotificationsIcon,
  PersonOutline as ProfileIcon
} from "@material-ui/icons";
import { NavLink as Link } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Tooltip,
  Typography
} from "@material-ui/core";
import { connect } from "react-redux";
// resist the temptation to make this like the rest of the action creators
// because of the potential of a circular dependency(auth/utils->api->auth/api->auth/redux/actions->auth->utils)
import {
  LOGOUT_ACTION,
  APIProfile,
  profileSelector
} from "../apps/authentication";
import { action } from "../redux/utils";
import { AppState } from "../redux";
import { BUILD } from "../utils";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex"
    },
    hide: {
      display: "none"
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0
    },
    drawerOpen: {
      whiteSpace: "normal",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    drawerClose: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      overflowX: "hidden",
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9) + 1
      },
      whiteSpace: "nowrap"
    },
    toolbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: theme.spacing(0, 2),
      ...theme.mixins.toolbar
    },
    content: {
      width: "100vw"
    },
    logoutButton: {
      marginTop: "auto"
    },
    selected: {
      backgroundColor: theme.palette.primary.main
    }
  })
);

interface Props {
  children: React.ReactNode;
  logout: Function;
  profile?: APIProfile;
}

export const NavDrawer: React.FC<Props> = ({ children, logout, profile }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = React.useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };
  const clearNotificationStorageAndLogout = () => {
    try {
      localStorage.removeItem("notification");
    } catch (error) {
      console.log(error);
    }
    logout();
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open
          })
        }}
        open={open}
      >
        <div className={classes.toolbar}>
          {open ? (
            <>
            <div>
              <Typography variant="h6">
                Dictionary Manager
              </Typography>
            </div>
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
            </>
          ) : (
            <IconButton onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          )}
        </div>
        <Divider component="hr" />
        <List component="div">
          <ListItem
            button
            dense={false}
            component={Link}
            exact
            activeClassName={classes.selected}
            to="/user/collections/"
            key="Dictionaries"
          >
            <Tooltip title="Dictionaries">
              <ListItemIcon className="list-item-icon">
                <FolderOpenOutlined />
              </ListItemIcon>
            </Tooltip>
            <ListItemText primary="Dictionaries" />
          </ListItem>
          <ListItem
            button
            dense={false}
            component={Link}
            exact
            activeClassName={classes.selected}
            to="/user/sources/"
            key="Your Sources"
          >
            <Tooltip title="Sources">
              <ListItemIcon className="list-item-icon">
                <AccountTreeOutlined />
              </ListItemIcon>
            </Tooltip>
            <ListItemText primary="Sources" />
          </ListItem>
        </List>
        <Divider component="hr" />
        <List component="div">
          <ListItem
            button
            dense={false}
            component={Link}
            exact
            activeClassName={classes.selected}
            to="/actions/"
            key="Notifications"
          >
            <Tooltip title="Notifications">
              <ListItemIcon className="list-item-icon">
                <NotificationsIcon />
              </ListItemIcon>
            </Tooltip>
            <ListItemText primary="Notifications" />
          </ListItem>
        </List>
        <Divider component="hr" />
        <div className={classes.logoutButton}>
          <Divider component="hr" />
          <List component="div">
            <ListItem
              button
              dense={false}
              component={Link}
              exact
              activeClassName={classes.selected}
              to="/user/"
              key="Your Profile"
            >
              <Tooltip title="Your Profile">
                <ListItemIcon className="list-item-icon">
                  <ProfileIcon />
                </ListItemIcon>
              </Tooltip>
              <ListItemText primary="Your Profile" />
            </ListItem>
            <ListItem
              button
              dense={false}
              component={Link}
              exact
              activeClassName={classes.selected}
              // to="/user/orgs/"
              to="/orgs/"
              key="Organisations"
            >
              <Tooltip title="Organisations">
                <ListItemIcon className="list-item-icon">
                  <People />
                </ListItemIcon>
              </Tooltip>
              <ListItemText primary="Organisations" />
            </ListItem>
            <ListItem
              onClick={() => setConfirmLogoutOpen(true)}
              button
              component="div"
              key={"Logout"}
            >
              <Tooltip title={`Logout (${profile?.username})`}>
                <ListItemIcon className="list-item-icon">
                  <ExitToApp />
                </ListItemIcon>
              </Tooltip>
              <ListItemText
                primary="Logout"
                secondary={`(${profile?.username})`}
              />
            </ListItem>
          </List>
          <Dialog
            maxWidth="xs"
            aria-labelledby="confirmation-dialog-title"
            open={confirmLogoutOpen}
            onClose={() => setConfirmLogoutOpen(false)}
          >
            <DialogTitle id="confirmation-dialog-title">
              Confirm Logout
            </DialogTitle>
            <DialogActions>
              <Button
                onClick={() => setConfirmLogoutOpen(false)}
                color="primary"
              >
                Cancel
              </Button>
              <Button
                onClick={clearNotificationStorageAndLogout}
                color="secondary"
              >
                Logout
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        {open && (
            <Typography
              variant="caption"
              component="div"
              className="MuiListItem-gutters"
            >
              OpenMRS Dictionary Manager: {BUILD}
            </Typography>
          )}
      </Drawer>
      <main className={classes.content}>{children}</main>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  profile: profileSelector(state)
});

const mapDispatchToProps = { logout: () => action(LOGOUT_ACTION) };

export default connect(mapStateToProps, mapDispatchToProps)(NavDrawer);
