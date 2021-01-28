import React, { useRef } from "react";
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

import { OrgMember } from "../types";

interface Props {
  onSubmit?: Function;
  orgUrl: string;
  loading?: boolean;
  error?: { detail: string };
  handleClose: () => void;
}

const AddMemberSchema = Yup.object().shape<OrgMember>({
  username: Yup.string().required("Username is Required"),
  name: Yup.string()
});

const initialValues: OrgMember = {
  username: "",
  name: "",
};

const AddMemberForm: React.FC<Props> = ({
  onSubmit,
  loading,
  error,
  handleClose
}) => {
  const formikRef: any = useRef(null);

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
                <Field
                  fullWidth
                  multiline
                  rowsMax={4}
                  id="name"
                  name="name"
                  label="Name"
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
                  {error.detail}
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