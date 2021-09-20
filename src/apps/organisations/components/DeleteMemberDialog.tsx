import React, { useRef } from "react";
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography
} from "@material-ui/core";
import { Form, Formik, FormikProps, FormikValues } from "formik";

interface Props {
  open: boolean;
  handleClose: () => void;
  handleSubmit?: () => void;
  user?: string;
  orgName: string;
  error?: {};
}

const DeleteMemberDialog: React.FC<Props> = ({
  open,
  handleClose,
  handleSubmit,
  user,
  orgName,
  error
}) => {
  const formikRef = useRef<FormikProps<FormikValues>>(null);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Remove {user}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to remove {user} from {orgName}?
        </DialogContentText>
        <Formik
          innerRef={formikRef}
          initialValues={{}}
          onSubmit={() => {
            if (handleSubmit) {
              handleSubmit();
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
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
                  <Button onClick={handleClose}>No</Button>
                  <Button type="submit" disabled={isSubmitting}>
                    Yes
                  </Button>
                </ButtonGroup>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMemberDialog;
