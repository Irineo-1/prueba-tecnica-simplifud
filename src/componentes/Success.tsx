'use client'

import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

type SuccsessAlertProps = {
    mensage: string
    open: boolean
    setOpen: (open: boolean) => void
}

export default function SuccsessAlert({mensage, open, setOpen} : SuccsessAlertProps) {

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Snackbar 
        anchorOrigin={{ vertical: 'top', horizontal: 'right'  }}
        open={open} 
        autoHideDuration={6000} 
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {mensage}
        </Alert>
      </Snackbar>
    </div>
  );
}