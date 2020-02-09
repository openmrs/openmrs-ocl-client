import React from "react";
import {
  createStyles,
  CircularProgress,
  makeStyles,
  Theme,
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    overlay: {
      position: "fixed",
      marginLeft: theme.spacing(7) + 1,
      marginTop: "6vh",
      height: "100%",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.1)",
      zIndex: 2,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignContent: "center"
      // paddingTop: '45%',
    },
    overlayContent: {
      margin: "auto",
      width: "60%",
      textAlign: "center"
    }
  })
);

interface Props {
  children: any;
  loading: boolean;
  loadingMessage?: string;
  delayRender?: boolean;
}

const Loader = ({ loadingMessage }: { loadingMessage: string }) => {
  const classes = useStyles();

  return (
    <div className={classes.overlay}>
      <div className={classes.overlayContent}>
        <CircularProgress thickness={0.8} size={50} />
        <br />
        {loadingMessage}
      </div>
    </div>
  );
};

const ProgressOverlay: React.FC<Props> = ({
  children,
  loading,
  loadingMessage = "Loading...",
  delayRender = false
}) => {
  if (loading && delayRender) return <Loader loadingMessage={loadingMessage} />;

  return (
    <>
      {children}
      {!loading ? "" : <Loader loadingMessage={loadingMessage} />}
    </>
  );
};

export default ProgressOverlay;
