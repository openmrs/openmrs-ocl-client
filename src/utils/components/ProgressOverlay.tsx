import React from "react";
import {
  CircularProgress,
  createStyles,
  makeStyles,
  Theme,
  Typography
} from "@material-ui/core";
import { BrokenImageOutlined as ErrorIcon } from "@material-ui/icons";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    overlay: {
      position: "fixed",
      height: "100%",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 2,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignContent: "center"
      // paddingTop: '45%',
    },
    blur: {
      backgroundColor: "rgba(0,0,0,0.1)" // almost transparent
    },
    overlayContent: {
      margin: "auto",
      width: "60%",
      textAlign: "center"
    }
  })
);

interface Props {
  children: React.ReactNode;
  loading: boolean;
  loadingMessage?: string;
  delayRender?: boolean;
  error?: string;
}

const Loader = ({ loadingMessage }: { loadingMessage: string }) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.overlay, classes.blur)} data-testid="loader-message">
      <div className={classes.overlayContent}>
        <CircularProgress thickness={0.8} size={50} />
        <br />
        {loadingMessage}
      </div>
    </div>
  );
};

const Error = ({ errorMessage }: { errorMessage: string }) => {
  const classes = useStyles();

  return (
    <div className={classes.overlay}>
      <div className={classes.overlayContent}>
        <ErrorIcon fontSize="large" />
        <br />
        <Typography variant="h6">{errorMessage}</Typography>
      </div>
    </div>
  );
};

const ProgressOverlay: React.FC<Props> = ({
  children,
  loading,
  loadingMessage = "Loading...",
  delayRender = false,
  error
}) => {
  if (loading && delayRender) return <Loader loadingMessage={loadingMessage} />;

  return (
    <>
      {error ? <Error errorMessage={error} /> : children}
      {!loading ? "" : <Loader loadingMessage={loadingMessage} data-testid='loader-message'/>}
    </>
  );
};

export default ProgressOverlay;
