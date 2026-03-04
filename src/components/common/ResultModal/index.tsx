import React from 'react';
import { Snackbar, Alert, AlertTitle } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import { useTranslation } from 'react-i18next';

interface ResultModalProps {
  open: boolean;
  isSuccess: boolean;
  onClose: () => void;
  message?: string;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  open,
  isSuccess,
  onClose,
  message = '',
}) => {
  const { t } = useTranslation();

  const autoHideDuration = isSuccess ? 1500 : 3000;

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      onClose={onClose}
    >
      <Alert
        icon={isSuccess ? <CheckIcon fontSize="inherit" /> : <ErrorIcon fontSize="inherit" />}
        severity={isSuccess ? 'success' : 'error'}
        onClose={onClose}
      >
        <AlertTitle>
          {isSuccess
            ? t('admin.products.edit.successTitle')
            : t('admin.products.edit.errorTitle')}
        </AlertTitle>
        {isSuccess
          ? t('admin.products.edit.successMessage')
          : `${t('message')} ${message}`}
      </Alert>
    </Snackbar>
  );
};
