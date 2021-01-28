import React, { useRef, useEffect } from "react";
import {
  Button,
  ButtonGroup,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { TextField } from "formik-material-ui";
import { usePrevious, getPrettyError } from "../../../utils";

import { OrgMember } from "../types";

interface Props {
  onSubmit?: Function;
  orgUrl: string;
  loading?: boolean;
  error?: {};
  handleClose: () => void;
}

const AddMemberSchema = Yup.object().shape<OrgMember>({
  username: Yup.string().required("Username is Required")
});

const initialValues: OrgMember = {
  username: "",
};

const AddMemberForm: React.FC<Props> = ({
  onSubmit,
  loading,
  error = '',
  handleClose
}) => {
  const formikRef: any = useRef(null);
  const previouslyLoading = usePrevious(loading);

  useEffect(() => {
    const { current: currentRef } = formikRef;
    if (currentRef) {
      currentRef.setSubmitting(loading);
    }
  }, [loading]);

  useEffect(() => {
    if (!loading && previouslyLoading && error) handleClose();
  }, [loading, previouslyLoading, error, handleClose]);

  return (
    <>
      <DialogTitle>Add new member</DialogTitle>
      <Formik
        ref={formikRef}
        initialValues={initialValues}
        validationSchema={AddMemberSchema}
        validateOnChange={false}
        onSubmit={(values: OrgMember) => {
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
                  id="username"
                  name="username"
                  label="Username"
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
                  {getPrettyError(error) || 'Could not submit'}
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

export default AddMemberForm;
