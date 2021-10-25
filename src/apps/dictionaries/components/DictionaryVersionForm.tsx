import React, { useEffect, useRef } from "react";
import {
  Button,
  ButtonGroup,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Typography
} from "@mui/material";
import { usePrevious } from "../../../utils";
import { Field, Form, Formik, FormikProps, FormikValues } from "formik";
import * as Yup from "yup";
import { Select, TextField } from "formik-material-ui";

import { DictionaryVersion } from "../types";
import { v4 as uuid } from "uuid";

interface Props {
  onSubmit: Function;
  loading: boolean;
  error?: { detail: string };
  handleClose: () => void;
}

const DictionaryVersionSchema = Yup.object().shape<DictionaryVersion>({
  id: Yup.string().required("Version ID is required"),
  released: Yup.boolean().required(
    "Choose whether you would like to release this version"
  ),
  description: Yup.string().min(0),
  external_id: Yup.string().required()
});

const initialValues: DictionaryVersion = {
  id: "",
  released: false,
  description: "",
  external_id: uuid()
};

const DictionaryVersionForm: React.FC<Props> = ({
  onSubmit,
  loading,
  error,
  handleClose
}) => {
  const formikRef = useRef<FormikProps<FormikValues & DictionaryVersion>>(null);
  const previouslyLoading = usePrevious(loading);

  useEffect(() => {
    const { current: currentRef } = formikRef;
    if (currentRef) {
      currentRef.setSubmitting(loading);
    }
  }, [loading]);

  useEffect(() => {
    if (!loading && previouslyLoading && !error) handleClose();
  }, [loading, previouslyLoading, error, handleClose]);

  return (
    <>
      <DialogTitle>Create new version</DialogTitle>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={DictionaryVersionSchema}
        validateOnChange={false}
        onSubmit={(values: DictionaryVersion) => {
          if (onSubmit) onSubmit(values);
        }}
      >
        {({ isSubmitting }) => (
          <>
            <Form>
              <DialogContent>
                <Field
                  fullWidth
                  autoComplete="off"
                  id="id"
                  name="id"
                  label="ID"
                  margin="normal"
                  component={TextField}
                />
                <FormControl
                  fullWidth
                  // required
                  margin="normal"
                >
                  <InputLabel htmlFor="released">Release</InputLabel>
                  <Field
                    fullWidth
                    id="released"
                    name="released"
                    label="Release?"
                    margin="normal"
                    component={Select}
                  >
                    <MenuItem>No</MenuItem>
                    <MenuItem>Yes</MenuItem>
                  </Field>
                </FormControl>
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
                <br />
                <br />
              </DialogContent>
              {!error ? (
                <br />
              ) : (
                <Typography
                  align="center"
                  color="error"
                  variant="caption"
                  component="div"
                >
                  {error}
                </Typography>
              )}
              <DialogActions>
                <ButtonGroup
                  fullWidth
                  color="primary"
                  variant="text"
                  size="medium"
                >
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}>
                    Submit
                  </Button>
                </ButtonGroup>
              </DialogActions>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default DictionaryVersionForm;
