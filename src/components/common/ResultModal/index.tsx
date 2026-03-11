import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  IconButton,
  Fade,
  CircularProgress,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import styles from './style.module.scss';

interface ResultModalProps {
  open: boolean;
  isSuccess: boolean;
  onClose: () => void;
  message?: string;
  isLoading?: boolean;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  open,
  isSuccess,
  onClose,
  message = '',
  isLoading = false,
}) => {
  const { t } = useTranslation();

  const autoHideDuration = isSuccess ? 2500 : 4000;
  const fallbackSuccessTitle = t('cart.request.successTitle', {
    defaultValue: t('admin.products.edit.successTitle'),
  });
  const fallbackSuccessMessage = t('cart.request.successMessage', {
    defaultValue: t('admin.products.edit.successMessage'),
  });
  const fallbackErrorTitle = t('cart.request.errorTitle', {
    defaultValue: t('admin.products.edit.errorTitle'),
  });
  const fallbackErrorMessage = t('cart.request.errorMessage', {
    defaultValue: t('message'),
  });
  const loadingTitle = t('cart.request.pendingTitle', {
    defaultValue: t('cart.actions.sending'),
  });
  const loadingMessage = message || t('cart.request.pendingMessage', {
    defaultValue: t('cart.dialog.description'),
  });
  const title = isLoading ? loadingTitle : isSuccess ? fallbackSuccessTitle : fallbackErrorTitle;
  const description = isLoading
    ? loadingMessage
    : message || (isSuccess ? fallbackSuccessMessage : fallbackErrorMessage);
  const titleClassName = [
    styles.resultModal__title,
    isLoading
      ? styles['resultModal__title--loading']
      : isSuccess
      ? styles['resultModal__title--success']
      : styles['resultModal__title--error'],
  ].join(' ');

  useEffect(() => {
    if (!open || isLoading) {
      return;
    }

    const timer = window.setTimeout(() => {
      onClose();
    }, autoHideDuration);

    return () => {
      window.clearTimeout(timer);
    };
  }, [open, autoHideDuration, onClose, isLoading]);

  return (
    <Dialog
      open={open}
      TransitionComponent={Fade}
      keepMounted
      onClose={onClose}
      PaperProps={{
        className: styles.resultModal__paper,
      }}
      BackdropProps={{
        className: styles.resultModal__backdrop,
      }}
    >
      <DialogTitle className={titleClassName}>
        <Box className={styles.resultModal__iconWrapper}>
          {isLoading ? (
            <CircularProgress
              size={36}
              thickness={4}
              className={styles.resultModal__iconSpinner}
            />
          ) : isSuccess ? (
            <CheckIcon className={styles.resultModal__iconSymbol} />
          ) : (
            <ErrorIcon className={styles.resultModal__iconSymbol} />
          )}
        </Box>
        <Typography
          variant="h6"
          component="span"
          className={styles.resultModal__titleText}
        >
          {title}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          className={styles.resultModal__closeButton}
          disabled={isLoading}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className={styles.resultModal__content}>
        <Typography variant="body1" color="text.primary" className={styles.resultModal__message}>
          {description}
        </Typography>
        {!isLoading && isSuccess && (
          <Typography
            variant="body2"
            color="text.secondary"
            className={styles.resultModal__followUp}
          >
            {t('cart.request.followUp', {
              defaultValue: t('cart.dialog.orderDescription'),
            })}
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};
