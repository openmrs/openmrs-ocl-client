import React, { useEffect } from 'react'
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
} from '@material-ui/core'
import { NotificationsOutlined as NotificationsIcon } from '@material-ui/icons'
import { connect } from 'react-redux'
import { addConceptsToDictionaryLoadingListSelector, } from '../apps/dictionaries'
import { AppState } from '../redux'
import { Link } from 'react-router-dom'

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
}

const Header: React.FC<Props> = ({
  children,
  title,
  justifyChildren = "center",
  loadingList = []
}) => {
  const loadingItemsLength = loadingList.filter((loading: boolean) => loading)
    .length;

  const classes = useStyles();
  useEffect(() => {
    document.title = `${title} | OCL for OpenMRS`;
  }, [title])

  return (
    <div>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h5" noWrap>
            {title}
          </Typography>
          <div className={classes.grow} />
          <div>
            {!(loadingItemsLength > 0) ? null : (
              <Link to="/actions/">
                <Tooltip title="In progress">
                  <IconButton>
                    <Badge badgeContent={loadingItemsLength} color="secondary">
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
  loadingList: addConceptsToDictionaryLoadingListSelector(state)
});

export default connect(mapStateToProps)(Header);
