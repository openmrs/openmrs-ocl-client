import React, { useEffect } from "react";
import {
  AppBar,
  Badge,
  createStyles,
  Grid,
  IconButton,
  makeStyles,
  Theme,
  Toolbar,
  Tooltip,
  Typography
} from "@material-ui/core";
import {
  ArrowBack as BackIcon,
  ArrowForward as ForwardIcon,
  NotificationsOutlined as NotificationsIcon
} from "@material-ui/icons";
import { connect } from "react-redux";
import { addConceptsToDictionaryLoadingListSelector } from "../apps/dictionaries";
import { AppState } from "../redux";
import { Link, useHistory } from "react-router-dom";

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
    icon: {
      color: theme.palette.background.default
    }
  })
);

interface Props {
  children: any;
  title: string;
  justifyChildren?: string;
  loadingList: boolean[];
  backUrl?: string;
  headerComponent?: any;
}

const Header: React.FC<Props> = ({
  children,
  title,
  justifyChildren = "center",
  loadingList = [],
  backUrl,
  headerComponent
}) => {
  const loadingItemsLength = loadingList.filter((loading: boolean) => loading)
    .length;

  const classes = useStyles();
  useEffect(() => {
    document.title = `${title} | OCL for OpenMRS`;
  }, [title]);
  const history = useHistory();

  return (
    <div>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Tooltip title="Go back">
            {backUrl ? (
              <Link to={backUrl}>
                <IconButton>
                  <BackIcon className={classes.icon} />
                </IconButton>
              </Link>
            ) : (
              <IconButton onClick={history.goBack}>
                <BackIcon className={classes.icon} />
              </IconButton>
            )}
          </Tooltip>
          <Typography variant="h5" noWrap>
            {title}
          </Typography>
          <div className={classes.grow} />
          {headerComponent ? headerComponent : null}
          <div>
            {!(loadingItemsLength > 0) ? null : (
              <Link to="/actions/">
                <Tooltip title="In progress">
                  <IconButton>
                    <Badge badgeContent={loadingItemsLength} color="secondary">
                      <NotificationsIcon className={classes.icon} />
                    </Badge>
                  </IconButton>
                </Tooltip>
              </Link>
            )}
            <Tooltip title="Go forward">
              <IconButton onClick={history.goForward}>
                <ForwardIcon className={classes.icon} />
            </IconButton>
            </Tooltip>
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
  loadingList: addConceptsToDictionaryLoadingListSelector(state)
});

export default connect(mapStateToProps)(Header);
