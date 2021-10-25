import React, { useRef, useEffect } from "react";
import {
  Button,
  ButtonGroup,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@mui/material";
import { Field, Form, Formik, FormikProps, FormikValues } from "formik";
import * as Yup from "yup";
import { TextField } from "formik-material-ui";
import { OrgMember } from "../types";
import { AppState } from "../../../redux";
import { addOrgMemberLoadingSelector } from "../redux";
import { connect } from "react-redux";
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
  username: ""
};

const AddMemberForm: React.FC<Props> = ({
  onSubmit,
  loading,
  error,
  handleClose
}) => {
  const formikRef = useRef<FormikProps<FormikValues & OrgMember>>(null);

  useEffect(() => {
    const { current: currentRef } = formikRef;
    if (currentRef) {
      currentRef.setSubmitting(!!loading);
    }
  }, [loading]);

  return (
    <>
      <DialogTitle>Add new member</DialogTitle>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={AddMemberSchema}
        validateOnChange={false}
        onSubmit={(values: OrgMember) => {
          if (onSubmit) {
            onSubmit(values);
          }
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

const mapStateToProps = (state: AppState) => ({
  loading: addOrgMemberLoadingSelector(state)
});

export default connect(mapStateToProps)(AddMemberForm);
