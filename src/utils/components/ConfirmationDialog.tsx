import React from "react";
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogTitle
} from "@material-ui/core";

interface Props {
  open: boolean;
  setOpen: Function;
  onConfirm: Function;
  message: JSX.Element | string;
  cancelButtonText: string;
  confirmButtonText: string;
}

const ConfirmationDialog: React.FC<Props> = ({
  open,
  setOpen,
  onConfirm,
  message,
  cancelButtonText,
  confirmButtonText
}) => {
  return (
    <Dialog
      data-testid="confirm-dialog"
      maxWidth="xs"
      aria-labelledby="confirmation-dialog-title"
      open={open}
      onClose={() => setOpen(false)}
    >
      <DialogTitle
        style={{ textAlign: "center" }}
        id="confirmation-dialog-title"
      >
        {message}
      </DialogTitle>
      <DialogActions style={{ textAlign: "center" }}>
        <ButtonGroup fullWidth color="primary" variant="text" size="medium">
          <Button onClick={() => setOpen(false)} color="secondary">
            {cancelButtonText}
          </Button>
          <Button onClick={() => onConfirm()} color="primary">
            {confirmButtonText}
          </Button>
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
