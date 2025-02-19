import { Fragment, ReactNode, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

type props = {
    open: boolean
    setOpen: (open: boolean) => void
    handleConfirmar: () => void
    children: ReactNode
    titulo: string
    textoBotonConfirmar: string
}

export default function Modal({open, setOpen, children, titulo, textoBotonConfirmar, handleConfirmar}: props) {

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>
          {titulo}
        </DialogTitle>
        <DialogContent>
          {children}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cerrar</Button>
          <Button onClick={handleConfirmar}>
            {textoBotonConfirmar}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}