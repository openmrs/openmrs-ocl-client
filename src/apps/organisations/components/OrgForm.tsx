import React, { useEffect, useRef } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Typography
} from "@material-ui/core";
import { CONTEXT, getPrettyError } from "../../../utils";
import { Organisation } from "../types";
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FormikProps,
  FormikValues
} from "formik";
import * as Yup from "yup";
import { Select, TextField } from "formik-material-ui";

interface Props {
  onSubmit?: (values: Organisation) => void;
  loading: boolean;
  status?: string;
  errors?: {};
  context?: string;
  savedValues?: Organisation;
}

const OrganisationSchema = Yup.object().shape<Organisation>({
  id: Yup.string().required("Organisation id is required"),
  name: Yup.string().required("Organisation name is required"),
  location: Yup.string().notRequired(),
  company: Yup.string().notRequired(),
  website: Yup.string()
    .url()
    .notRequired(),
  public_access: Yup.string().notRequired()
});

const initialValues: Organisation = {
  id: "",
  name: "",
  company: "",
  website: "",
  location: "",
  public_access: "View"
};

const useStyles = makeStyles({
  organisationForm: {
    padding: "2vh 2vw"
  },
  submitButton: {
    textAlign: "center"
  }
});

const OrganisationForm: React.FC<Props> = ({
  onSubmit,
  context = CONTEXT.view,
  savedValues,
  errors,
  status,
  loading
}) => {
  const classes = useStyles();
  const editing = context === CONTEXT.edit;
  const error = getPrettyError(errors);

  const formikRef = useRef<FormikProps<FormikValues & Organisation>>(null);

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
    <div id="organisation-form" className={classes.organisationForm}>
      <Formik
        innerRef={formikRef}
        initialValues={savedValues || initialValues}
        validationSchema={OrganisationSchema}
        validateOnChange={false}
        onSubmit={(values: Organisation) => {
          if (onSubmit) onSubmit(values);
        }}
      >
        {({ isSubmitting }) => (
          <Form translate="">
            <Field
              // required
              fullWidth
              autoComplete="off"
              disabled={editing || isSubmitting}
              id="id"
              name="id"
              label="Organisation ID"
              margin="normal"
              multiline
              rowsMax={4}
              component={TextField}
            />
            <Field
              // required
              fullWidth
              autoComplete="off"
              id="name"
              name="name"
              label="Organisation Name"
              margin="normal"
              multiline
              rowsMax={4}
              component={TextField}
            />
            <Field
              fullWidth
              disabled={isSubmitting}
              autoComplete="off"
              id="company"
              name="company"
              label="Company"
              margin="normal"
              multiline
              rowsMax={4}
              component={TextField}
            />
            <Field
              fullWidth
              multiline
              rowsMax={4}
              id="website"
              name="website"
              label="Website"
              margin="normal"
              component={TextField}
            />
            <Field
              fullWidth
              multiline
              rowsMax={4}
              id="location"
              name="location"
              label="Location"
              margin="normal"
              component={TextField}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="public_access">Public Access</InputLabel>
              <Field name="public_access" id="public_access" component={Select}>
                <MenuItem value="View">View</MenuItem>
                <MenuItem value="None">Edit</MenuItem>
                <MenuItem value="None">None</MenuItem>
              </Field>
              <Typography color="error" variant="caption" component="div">
                <ErrorMessage name="public_access" component="span" />
              </Typography>
            </FormControl>

            <br />
            <br />
            <div className={classes.submitButton}>
              {!error ? (
                <br />
              ) : (
                <Typography color="error" variant="caption" component="div">
                  {error}
                </Typography>
              )}
              <Button
                variant="outlined"
                color="primary"
                size="medium"
                type="submit"
                disabled={isSubmitting}
              >
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default OrganisationForm;
