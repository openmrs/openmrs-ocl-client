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
import { Select, TextField } from "formik-mui";

import { Version } from "../../../utils";
import { v4 as uuid } from "uuid";

interface Props {
  onSubmit: Function;
  loading: boolean;
  error?: { detail: string };
  handleClose: () => void;
}

const ContainerVersionSchema = Yup.object().shape<Version>({
  id: Yup.string().required("Version ID is required"),
  released: Yup.boolean().required(
    "Choose whether you would like to release this version"
  ),
  description: Yup.string().min(0),
  external_id: Yup.string().required()
});

const initialValues: Version = {
  id: "",
  released: false,
  description: "",
  external_id: uuid()
};

const ContainerVersionForm: React.FC<Props> = ({
  onSubmit,
  loading,
  error,
  handleClose
}) => {
  const formikRef = useRef<FormikProps<FormikValues & Version>>(null);
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
        validationSchema={ContainerVersionSchema}
        validateOnChange={false}
        onSubmit={(values: Version) => {
          if (onSubmit) onSubmit(values);
        }}
      >
        {({ isSubmitting }) => (
          <>
            <Form>
              <DialogContent>
                <Field
                  variant="standard"
                  fullWidth
                  autoComplete="off"
                  id="id"
                  name="id"
                  label="ID"
                  component={TextField}
                />
                <FormControl
                  variant="standard"
                  fullWidth
                  // required
                  margin="normal"
                >
                  <InputLabel shrink htmlFor="released">
                    Release
                  </InputLabel>
                  <Field
                    variant="standard"
                    fullWidth
                    id="released"
                    name="released"
                    component={Select}
                  >
                    <MenuItem
                      // @ts-ignore: some casting is done for us we don't need to worry about using booleans as values
                      value={0}
                    >
                      No
                    </MenuItem>
                    <MenuItem
                      // @ts-ignore
                      value={1}
                    >
                      Yes
                    </MenuItem>
                  </Field>
                </FormControl>
                <Field
                  variant="standard"
                  fullWidth
                  multiline
                  rowsMax={4}
                  id="description"
                  name="description"
                  label="Description"
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

export default ContainerVersionForm;
