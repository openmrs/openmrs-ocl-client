import React from "react";
import { makeStyles, Snackbar, SnackbarCloseReason } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

interface Props {
  message?: string;
  type:string;
  open: boolean;
  setOpen: Function;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(1),
    },
  },
}));

const ToastAlert = ({message='', type, open, setOpen}:Props) => {
  const handleClose = (_: any, reason: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const classes = useStyles();
  return message !== '' ?
    <div className={classes.root}>
      {type === "error" ? 
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={open}
          autoHideDuration={2000}
          onClose={handleClose}>
            <Alert severity="error">
              {message}
            </Alert>
        </Snackbar> :
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={open}
          autoHideDuration={2000}
          onClose={handleClose}>
            <Alert severity="success">
              {message}
            </Alert>
        </Snackbar>
      }
    </div> : null;
}

export default ToastAlert;
