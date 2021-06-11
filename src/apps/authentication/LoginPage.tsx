import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Container, Grid, makeStyles, Typography } from "@material-ui/core";
import { Login } from "./components";
import { authErrorsSelector, authLoadingSelector } from "./redux/reducer";
import { clearNextPageAction, loginAction } from "./redux";
import { AppState } from "../../redux/types";
import { BUILD, TRADITIONAL_OCL_URL } from "../../utils";

interface Props {
  isLoggedIn: boolean;
  login: (...args: Parameters<typeof loginAction>) => void;
  loading: boolean;
  errors?: any;
  nextPage?: string;
  clearNextPage: (...args: Parameters<typeof clearNextPageAction>) => void;
}

const useStyles = makeStyles({
  loginPage: {
    display: "flex",
    height: "100vh"
  },
  header: {
    textAlign: "center",
    margin: "-6vh 0 5vh 0"
  },
  title: {
    marginBottom: "1.3rem"
  },
  footerText: {
    textAlign: "center"
  }
});

const LoginPage: React.FC<Props> = ({
  isLoggedIn,
  login,
  loading,
  errors,
  nextPage,
  clearNextPage
}: Props) => {
  const classes = useStyles();

  useEffect(() => {
    document.title = `Login | OpenMRS Dictionary Manager`;

    return () => {
      document.title = "OpenMRS Dictionary Manager";
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn && nextPage) {
      clearNextPage();
    }
  }, [isLoggedIn, nextPage, clearNextPage]);

  if (isLoggedIn) {
    if (nextPage) {
      return <Redirect to={nextPage} />;
    }

    return <Redirect to="/" />;
  } else {
    return (
      <>
        <Grid
          container
          justify="center"
          alignItems="center"
          className={classes.loginPage}
          component={Container}
        >
          <Grid
            xs={5}
            container
            item
            component="div"
            justify="center"
            alignItems="center"
            className={classes.header}
          >
            <Typography variant="h3" component="h3" className={classes.title}>
              OpenMRS Dictionary Manager
            </Typography>
            <Typography variant="subtitle1" component="span">
              Use the shared{" "}
              <a
                href={TRADITIONAL_OCL_URL}
                target="_blank"
                rel="external noopener noreferrer"
              >
                Open Concept Lab
              </a>{" "}
              environment to create OpenMRS dictionary by mixing expert-defined
              content with your own custom concepts.
            </Typography>
            <Login onSubmit={login} loading={loading} status={errors} />
          </Grid>
        </Grid>
        <Typography
          variant="caption"
          className={classes.footerText}
          component="div"
        >
          OpenMRS Dictionary Manager: {BUILD}
        </Typography>
      </>
    );
  }
};

const mapStateToProps = (state: AppState) => ({
  isLoggedIn: state.auth.isLoggedIn,
  loading: authLoadingSelector(state),
  errors: authErrorsSelector(state),
  nextPage: state.auth.nextPage
});

const mapActionsToProps = {
  login: loginAction,
  clearNextPage: clearNextPageAction
};

export default connect(mapStateToProps, mapActionsToProps)(LoginPage);
