import React from "react";
import { Redirect } from "react-router-dom";
import { Grid, Container, Typography } from "@material-ui/core";
import { Login } from "./components";
import "./LoginPage.scss";
import { connect } from "react-redux";
import { authErrorsSelector, authLoadingSelector } from "./redux/reducer";
import { loginAction } from "./redux/actions";

interface Props {
  isLoggedIn: boolean;
  login: Function;
  loading: boolean;
  errors?: any;
}

const LoginPage: React.FC<Props> = ({
  isLoggedIn,
  login,
  loading,
  errors = {}
}: Props) => {
  if (isLoggedIn) return <Redirect to="/" />;
  // todo add redirect url use
  else
    return (
      <Grid
        container
        justify="center"
        alignItems="center"
        id="login-page"
        component={Container}
      >
        <Grid xs={4} item component="div">
          <div className="header-text">
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
          <Login onSubmit={login} loading={loading} status={errors.detail} />
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
