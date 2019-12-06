import React from "react";
import {
  AppBar,
  createStyles,
  Grid,
  IconButton,
  makeStyles,
  Theme,
  Toolbar,
  Typography,
  Badge,
  Tooltip
} from "@material-ui/core";
import { NotificationsOutlined as NotificationsIcon } from "@material-ui/icons";
import { connect } from "react-redux";
import {
  addConceptsToCollectionLoadingListSelector,
  addConceptsToCollectionProgressListSelector
} from "../apps/collections";
import { AppState } from "../redux";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      paddingLeft: theme.spacing(7) + 1
    },
    content: {
      marginTop: "6vh",
      height: "100%"
    },
    grow: {
      flexGrow: 1
    },
    notifications: {
      position: "absolute",
      marginTop: "11vh",
      top: 0,
      right: "3vw",
      height: "33vh",
      width: "20vw",
      background: theme.palette.background.default,
      zIndex: 1
    }
  })
);

interface Props {
  children: any;
  title: string;
  justifyChildren?: string;
  loadingList: boolean[];
  inProgressList: string[];
}

const Header: React.FC<Props> = ({
  children,
  title,
  justifyChildren = "center",
  loadingList,
  inProgressList
}) => {
  const inProgressItems = loadingList
    .map((loading: boolean, index: number) =>
      loading ? inProgressList[index] : null
    )
    .filter(item => item)
    .reverse();
  const anyInProgressItems = inProgressItems.length > 0;

  const classes = useStyles();

  return (
    <div>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h5" noWrap>
            {title}
          </Typography>
          <div className={classes.grow} />
          <div>
            {!anyInProgressItems ? null : (
              <Link to="/actions/">
                <Tooltip title="In progress">
                  <IconButton>
                    <Badge
                      badgeContent={inProgressItems.length}
                      color="secondary"
                    >
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
              </Link>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <Grid
        container
        className={classes.content}
        component="div"
        // @ts-ignore
        justify={justifyChildren}
        alignItems="flex-start"
      >
        {children}
      </Grid>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  loadingList: addConceptsToCollectionLoadingListSelector(state),
  inProgressList: addConceptsToCollectionProgressListSelector(state)
});

export default connect(mapStateToProps)(Header);
