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
  children?: React.ReactNode;
  title: string;
  justifyChildren?: string;
  loadingList: boolean[];
  backUrl?: string;
  backText?: string;
  headerComponent?: React.ReactNode;
  allowImplicitNavigation?: boolean;
}

const Header: React.FC<Props> = ({
  children,
  title,
  justifyChildren = "center",
  loadingList = [],
  backUrl,
  backText = "Go back",
  headerComponent,
  allowImplicitNavigation = false
}) => {
  const loadingItemsLength = loadingList.filter((loading: boolean) => loading)
    .length;

  const classes = useStyles();
  useEffect(() => {
    document.title = `${title} | OCL for OpenMRS`;
  }, [title]);
  const history = useHistory();

  return (
    <div data-testid="header">
      <AppBar position="relative" className={classes.appBar}>
        <Toolbar>
          {backUrl ? (
            <Tooltip title={backText}>
              <Link to={backUrl}>
                <IconButton>
                  <BackIcon className={classes.icon} />
                </IconButton>
              </Link>
            </Tooltip>
          ) : allowImplicitNavigation ? (
            <Tooltip title="Go back">
              <IconButton onClick={history.goBack}>
                <BackIcon className={classes.icon} />
              </IconButton>
            </Tooltip>
          ) : (
            <span />
          )}
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
