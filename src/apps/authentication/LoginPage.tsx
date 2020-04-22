import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Container, Grid, makeStyles, Typography } from "@material-ui/core";
import { Login } from "./components";
import { connect } from "react-redux";
import { authErrorsSelector, authLoadingSelector } from "./redux/reducer";
import { loginAction } from "./redux";

interface Props {
  isLoggedIn: boolean;
  login: (...args: Parameters<typeof loginAction>) => void;
  loading: boolean;
  errors?: any;
}

const useStyles = makeStyles({
  loginPage: {
    height: "100vh"
  },
  headerText: {
    textAlign: "center",
    margin: "-6vh 0 5vh 0"
  }
});

const LoginPage: React.FC<Props> = ({
  isLoggedIn,
  login,
  loading,
  errors = {}
}: Props) => {
  const classes = useStyles();

  useEffect(() => {
    document.title = `Login | OCL for OpenMRS`;

    return () => {
      document.title = "OCL for OpenMRS";
    };
  }, []);

  if (isLoggedIn) return <Redirect to="/" />;
  else
    return (
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
              Use the shared Open Concept Lab to create OpenMRS dictionaries by
              mixing expert-defined content with your own custom concepts.
            </Typography>
          </div>
          <Login
            onSubmit={login}
            loading={loading}
            status={errors ? errors.detail : ""}
          />
        </Grid>
      </Grid>
    );
};

const mapStateToProps = (state: any) => ({
  isLoggedIn: state.auth.isLoggedIn,
  loading: authLoadingSelector(state),
  errors: authErrorsSelector(state)
});
const mapDispatchToProps = { login: loginAction };

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
