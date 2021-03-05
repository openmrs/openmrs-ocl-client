import React, { useEffect, useRef } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Typography
} from "@material-ui/core";
import {
  getCustomErrorMessage,
  getPrettyError,
  PREFERRED_SOURCES,
  CONTEXT
} from "../../../utils";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { Select, TextField } from "formik-material-ui";
import { snakeCase } from "lodash";
import { Dictionary, APIDictionary, dictionaryToCopyableDictionary } from "../types";
import { APIOrg, APIProfile } from "../../authentication";
import {
  showDefaultLocale,
  showOrganisationHeader,
  showUserName,
  showUserOrganisations,
  supportedLocalesLabel
} from "../../containers/components/FormUtils";

interface Props {
  onSubmit?: Function;
  loading: boolean;
  status?: string;
  profile?: APIProfile;
  usersOrgs: APIOrg[];
  errors?: {};
  savedValues?: Dictionary;
  copiedDictionary?: APIDictionary;
  context?: string;
}

const DictionarySchema = Yup.object().shape<Dictionary>({
  name: Yup.string().required("Dictionary name is required"),
  short_code: Yup.string()
    .required("Short code is required")
    .matches(/^[a-zA-Z0-9\-.]+$/, "Alphanumeric characters, - and . only"),
  description: Yup.string().min(0),
  preferred_source: Yup.string()
    .required("Select a preferred source")
    .oneOf(Object.keys(PREFERRED_SOURCES), "This source is not supported"),
  owner_url: Yup.string().required("Select this dictionary's owner"),
  public_access: Yup.string().required(
    "Select who will have access to this dictionary"
  ),
  default_locale: Yup.string().required("Select a preferred language"),
  supported_locales: Yup.array(Yup.string())
});

const initialValues: Dictionary = {
  name: "",
  short_code: "",
  description: "",
  preferred_source: "",
  owner_url: "",
  public_access: "",
  default_locale: "",
  supported_locales: []
};

const useStyles = makeStyles({
  dictionaryForm: {
    padding: "2vh 2vw"
  },
  submitButton: {
    textAlign: "center"
  }
});

const DictionaryForm: React.FC<Props> = ({
  onSubmit,
  loading,
  status, // todo start using this to show action progress
  profile,
  usersOrgs,
  errors,
  context = CONTEXT.view,
  savedValues,
  copiedDictionary
}) => {
  const classes = useStyles();


  const copy = { ...initialValues, ...copiedDictionary ? dictionaryToCopyableDictionary(copiedDictionary): copiedDictionary } as APIDictionary;

  const viewing = context === CONTEXT.view;
  const editing = context === CONTEXT.edit;

  const formikRef: any = useRef(null);
  const statusCodesWeCareAbout = {
    403: `You don't have permission to ${context} a dictionary in this Organisation`
  };
  let error: string | undefined = getCustomErrorMessage(
    getPrettyError(errors),
    statusCodesWeCareAbout
  );

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

  useEffect(() => {
    const { current: currentRef } = formikRef;
    if (!currentRef) return;

    Object.keys(initialValues).forEach(key => {
      const error = getPrettyError(
        errors,
        snakeCase(key === "short_code" ? "id" : key) // id and short_code are the same value. error comes back in id
      );
      if (error) currentRef.setFieldError(key, error);
    });
  }, [errors]);

  return (
    <div id="dictionary-form" className={classes.dictionaryForm}>
      <Formik
        ref={formikRef}
        initialValues={savedValues || copy || initialValues }
        validationSchema={DictionarySchema}
        validateOnChange={false}
        onSubmit={(values: Dictionary) => {
          if (onSubmit) {
            onSubmit(values, copy.references)
          }
        }}
      >
        {({ isSubmitting, status, values }) => (
          <Form>
            <Field
              // required
              fullWidth
              autoComplete="off"
              id="name"
              name="name"
              label="Dictionary Name"
              margin="normal"
              multiline
              rowsMax={4}
              component={TextField}
            />
            <Field
              // required
              fullWidth
              disabled={editing || isSubmitting}
              autoComplete="off"
              id="short_code"
              name="short_code"
              label="Short Code"
              margin="normal"
              multiline
              rowsMax={4}
              component={TextField}
            />
            <Field
              fullWidth
              multiline
              rowsMax={4}
              id="description"
              name="description"
              label="Description"
              margin="normal"
              component={TextField}
            />
            <FormControl
              fullWidth
              // required
              margin="normal"
            >
              <InputLabel htmlFor="preferred_source">
                Preferred Source
              </InputLabel>
              <Field
                name="preferred_source"
                id="preferred_source"
                component={Select}
              >
                {Object.keys(PREFERRED_SOURCES).map(preferredSource => (
                  <MenuItem key={preferredSource} value={preferredSource}>
                    {preferredSource}
                  </MenuItem>
                ))}
              </Field>
              <Typography color="error" variant="caption" component="div">
                <ErrorMessage name="preferred_source" component="span" />
              </Typography>
            </FormControl>
            <FormControl
              fullWidth
              // required
              margin="normal"
            >
              <InputLabel htmlFor="owner_url">Owner</InputLabel>
              <Field
                value=""
                disabled={editing || isSubmitting}
                name="owner_url"
                id="owner_url"
                multiline
                rowsMax={4}
                component={Select}
              >
                {showUserName(profile)}
                {showOrganisationHeader(usersOrgs)}
                {showUserOrganisations(usersOrgs)}
              </Field>
              <Typography color="error" variant="caption" component="div">
                <ErrorMessage name="owner_url" component="span" />
              </Typography>
            </FormControl>
            <FormControl
              fullWidth
              // required
              margin="normal"
            >
              <InputLabel htmlFor="public_access">Visibility</InputLabel>
              <Field name="public_access" id="public_access" component={Select}>
                <MenuItem value="View">Public</MenuItem>
                <MenuItem value="None">Private</MenuItem>
              </Field>
              <Typography color="error" variant="caption" component="div">
                <ErrorMessage name="public_access" component="span" />
              </Typography>
            </FormControl>
            <FormControl
              fullWidth
              // required
              margin="normal"
            >
              <InputLabel htmlFor="default_locale">
                Preferred Language
              </InputLabel>
              <Field
                name="default_locale"
                id="default_locale"
                component={Select}
              >
                {showDefaultLocale()}
              </Field>
              <Typography color="error" variant="caption" component="div">
                <ErrorMessage name="default_locale" component="span" />
              </Typography>
            </FormControl>
            <FormControl
              fullWidth
              // required
              margin="normal"
            >
              <InputLabel htmlFor="supported_locales">
                Other Languages
              </InputLabel>
              <Field
                multiple
                fullWidth
                defaultValue={[]}
                name="supported_locales"
                id="supported_locales"
                component={Select}
                style={{whiteSpace: "inherit !important"}}
              >
                {supportedLocalesLabel(values)}
              </Field>
              <Typography color="error" variant="caption" component="div">
                <ErrorMessage name="supported_locales" component="span" />
              </Typography>
            </FormControl>
            {!viewing ? (
              ""
            ) : (
              <Field
                fullWidth
                multiline
                rowsMax={4}
                // defaultValue="None"
                id="linked_source"
                name="extras.source"
                label="Linked Source"
                helperText="Custom concepts created for this dictionary will be kept here."
                margin="normal"
                component={TextField}
              />
            )}
            <br />
            <br />
            {viewing ? (
              ""
            ) : (
              <div className={classes.submitButton}>
                {!status ? (
                  <br />
                ) : (
                  <Typography
                    color="textSecondary"
                    variant="caption"
                    component="span"
                  >
                    {status}
                  </Typography>
                )}
                {!error ? (
                  <br />
                ) : (
                  <Typography color="error" variant="caption" component="span">
                    {error}
                  </Typography>
                )}
                <br />
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
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default DictionaryForm;
