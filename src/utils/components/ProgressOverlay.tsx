import React from 'react';
import { AppBar, createStyles, Grid, CircularProgress, makeStyles, Theme, Toolbar, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    overlay: {
      position: 'fixed',
      marginLeft: theme.spacing(7) + 1,
      marginTop: '6vh',
      height: '100%',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.1)',
      zIndex: 2,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignContent: 'center',
      // paddingTop: '45%',
    },
    overlayContent: {
      margin: 'auto',
      width: '60%',
      textAlign: 'center',
    },
  }),
);

interface Props {
  children: any,
  loading: boolean,
  loadingMessage?: string,
  delayRender?: boolean,
}

const ProgressOverlay: React.FC<Props> = ({children, loading, loadingMessage="Loading...", delayRender=false}) => {
  const classes = useStyles();

  if (loading && delayRender) return <span>{loadingMessage}</span>;

  return (
    <>
      {children}
      {!loading ? '' : (
        <div className={classes.overlay}>
          <div className={classes.overlayContent}>
            <CircularProgress thickness={.8} size={50} />
            <br/>
            {loadingMessage}
          </div>
        </div>
        )}
    </>
  );
};

export default ProgressOverlay;
