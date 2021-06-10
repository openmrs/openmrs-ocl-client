import React, { useEffect, useRef } from "react";
import { Button, Link, makeStyles, Paper, Typography } from "@material-ui/core";
import { OCL_SIGNUP_URL, TRADITIONAL_OCL_URL } from "../../../utils/constants";
import { Field, Form, Formik, FormikProps, FormikValues } from "formik";
import * as Yup from "yup";
import { TextField } from "formik-material-ui";

interface Props {
  onSubmit: Function;
  loading: boolean;
  status?: string;
}

const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required")
});

const useStyles = makeStyles({
  otherOptions: {
    textAlign: "center"
  },
  fields: {
    padding: "2vh 1vw",
    display: "inherit"
  },
  statusMessage: {
    display: "inline-block",
    width: "100%",
    textAlign: "center"
  }
});

const Login: React.FC<Props> = ({ onSubmit, loading, status }) => {
  const classes = useStyles();

  const formikRef = useRef<FormikProps<FormikValues>>(null);

  useEffect(() => {
    const { current: currentRef } = formikRef;
    if (currentRef) {
      currentRef.setSubmitting(loading);
    }
  }, [loading]);

  useEffect(() => {
    const { current: currentRef } = formikRef;
    if (currentRef) {
      currentRef.setStatus(status);
    }
  }, [status]);

  return (
    <Paper id="login-form">
      <Formik
        innerRef={formikRef}
        initialValues={{ username: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={({ username, password }) => onSubmit(username, password)}
      >
        {({ isSubmitting, status }) => (
          <Form className="fieldsetParent">
            <fieldset>
              <Typography variant="h6" component="legend">
                Log In
              </Typography>
              <div className={classes.fields}>
                <Field
                  fullWidth
                  type="text"
                  name="username"
                  id="username"
                  label="Username"
                  margin="dense"
                  variant="outlined"
                  component={TextField}
                />
                <br />

                <Field
                  type="password"
                  name="password"
                  id="password"
                  label="Password"
                  margin="dense"
                  fullWidth
                  variant="outlined"
                  component={TextField}
                />
                <br />
                <br />

                <Button
                  variant="outlined"
                  color="primary"
                  size="medium"
                  type="submit"
                  fullWidth
                  disabled={isSubmitting}
                >
                  Log in
                </Button>
                {!status ? (
                  <br />
                ) : (
                  <Typography
                    className={classes.statusMessage}
                    color="error"
                    variant="caption"
                    component="span"
                    data-testid="login-status-message"
                  >
                    {status}
                  </Typography>
                )}
                <br />
                <br />
                <div className={classes.otherOptions}>
                  <div>
                    <Link
                      target="_blank"
                      component="a"
                      variant="body2"
                      href={OCL_SIGNUP_URL}
                    >
                      Sign up
                    </Link>
                  </div>
                  <div>
                    <Link
                      target="_blank"
                      component="a"
                      variant="body2"
                      href={TRADITIONAL_OCL_URL}
                    >
                      Go to Open Concept Lab
                    </Link>
                  </div>
                </div>
              </div>
            </fieldset>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default Login;
