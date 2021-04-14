import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Container, Grid, makeStyles, Typography } from "@material-ui/core";
import { Login } from "./components";
import { authErrorsSelector, authLoadingSelector } from "./redux/reducer";
import { clearNextPageAction, loginAction } from "./redux";
import { AppState } from "../../redux/types";
import { BUILD } from "../../utils";

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
  headerText: {
    textAlign: "center",
    margin: "-6vh 0 5vh 0"
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
    document.title = `Login | OCL for OpenMRS`;

    return () => {
      document.title = "OCL for OpenMRS";
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
          <Grid xs={4} item component="div">
            <div className={classes.headerText}>
              <Typography variant="h3" component="h3">
                Open Concept Lab
              </Typography>
              <Typography variant="h4" component="h4">
                for OpenMRS
              </Typography>
              <Typography variant="subtitle1" component="span">
                Use the shared Open Concept Lab to create OpenMRS dictionaries
                by mixing expert-defined content with your own custom concepts.
              </Typography>
            </div>
            <Login onSubmit={login} loading={loading} status={errors} />
          </Grid>
        </Grid>
        <Typography
          variant="caption"
          className={classes.footerText}
          component="div"
        >
          OCL for OMRS Build: {BUILD}
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

const mapDispatchToProps = {
  login: loginAction,
  clearNextPage: clearNextPageAction
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
