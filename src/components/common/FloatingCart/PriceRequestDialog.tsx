import { useEffect, useState } from 'react';
import { CartItem, PriceRequestFormValues } from '@app-types/cart';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import styles from './style.module.scss';

interface PriceRequestDialogProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onSubmit: (values: PriceRequestFormValues) => Promise<void> | void;
  isSubmitting: boolean;
  isOrderMode: boolean;
}

const emptyForm: PriceRequestFormValues = {
  requesterName: '',
  companyName: '',
  email: '',
  phone: '',
  note: '',
};

const PriceRequestDialog: React.FC<PriceRequestDialogProps> = ({
  open,
  onClose,
  items,
  onSubmit,
  isSubmitting,
  isOrderMode,
}) => {
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState<PriceRequestFormValues>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof PriceRequestFormValues, string>>>({});
  const dialogTitle = isOrderMode ? t('cart.dialog.orderTitle') : t('cart.dialog.title');
  const dialogDescription = isOrderMode ? t('cart.dialog.orderDescription') : t('cart.dialog.description');
  const trimmedName = formValues.requesterName.trim();
  const trimmedCompany = formValues.companyName.trim();
  const trimmedEmail = formValues.email.trim();
  const trimmedPhone = formValues.phone.trim();
  const hasIdentity = Boolean(trimmedName || trimmedCompany);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[0-9()+\-\s]{6,}$/;
  const hasEmail = Boolean(trimmedEmail);
  const hasPhone = Boolean(trimmedPhone);
  const isEmailFormatValid = !hasEmail || emailPattern.test(trimmedEmail);
  const isPhoneFormatValid = !hasPhone || phonePattern.test(trimmedPhone);

  useEffect(() => {
    if (!open) {
      setFormValues(emptyForm);
      setErrors({});
    }
  }, [open]);

  const handleChange = (field: keyof PriceRequestFormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleDialogClose = (_event: object, _reason: 'backdropClick' | 'escapeKeyDown') => {
    if (isSubmitting) {
      return;
    }
    onClose();
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof PriceRequestFormValues, string>> = {};
    const hasName = Boolean(trimmedName);
    const hasCompany = Boolean(trimmedCompany);

    if (!hasName && !hasCompany) {
      const identityError = t('cart.form.validation.identity');
      nextErrors.requesterName = identityError;
      nextErrors.companyName = identityError;
    }

    if (!hasEmail) {
      nextErrors.email = t('cart.form.validation.emailRequired');
    } else if (!isEmailFormatValid) {
      nextErrors.email = t('cart.form.validation.email');
    }

    if (hasPhone && !isPhoneFormatValid) {
      nextErrors.phone = t('cart.form.validation.phone');
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    try {
      await onSubmit(formValues);
    } catch (error) {
      // Parent component handles error presentation.
    }
  };

  return (
    <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="sm">
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary">
          {dialogDescription}
        </Typography>

        <Box className={styles.cartDialog__list}>
          {items.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              {t('cart.dialog.empty')}
            </Typography>
          )}
          {items.map((item) => (
            <Box key={item.key} className={styles.cartDialog__listItem}>
              <Box>
                <Typography variant="subtitle2" fontWeight={600}>
                  {item.product.name}
                </Typography>
                {item.product.productNo && (
                  <Typography variant="caption" color="text.secondary">
                    {t('cart.productCode', { code: item.product.productNo })}
                  </Typography>
                )}
                {item.materialLabel && (
                  <Typography variant="caption" color="text.secondary">
                    {t('material')}: {item.materialLabel}
                  </Typography>
                )}
                {item.environmentLabel && (
                  <Typography variant="caption" color="text.secondary">
                    {t('environment')}: {item.environmentLabel}
                  </Typography>
                )}
              </Box>
              <Box textAlign="right">
                {isOrderMode && item.product.price?.amount && item.product.price?.currency ? (
                  <Typography variant="caption" color="text.secondary">
                    {t('cart.dialog.priceQuantityLabel', {
                      price: item.product.price.amount,
                      currency: item.product.price.currency,
                      quantity: item.quantity,
                    })}
                  </Typography>
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    {t('cart.dialog.quantityLabel', { quantity: item.quantity })}
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
        </Box>

        <Box mt={3}>
          <Grid container spacing={2}>
             <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label={t('cart.form.name')}
                value={formValues.requesterName}
                onChange={(event) => handleChange('requesterName', event.target.value)}
                fullWidth
                placeholder={t('cart.form.placeholder.name')}
                error={Boolean(errors.requesterName)}
                helperText={errors.requesterName}
                disabled={isSubmitting}
              />
            </Grid>
           <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label={t('cart.form.company')}
                value={formValues.companyName}
                onChange={(event) => handleChange('companyName', event.target.value)}
                fullWidth
                placeholder={t('cart.form.placeholder.company')}
                error={Boolean(errors.companyName)}
                helperText={errors.companyName}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label={t('cart.form.email')}
                type="email"
                value={formValues.email}
                onChange={(event) => handleChange('email', event.target.value)}
                fullWidth
                placeholder={t('cart.form.placeholder.email')}
                error={Boolean(errors.email)}
                helperText={errors.email}
                disabled={isSubmitting}
              />
            </Grid>
           <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label={t('cart.form.phone')}
                value={formValues.phone}
                onChange={(event) => handleChange('phone', event.target.value)}
                fullWidth
                placeholder={t('cart.form.placeholder.phone')}
                error={Boolean(errors.phone)}
                helperText={errors.phone}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label={t('cart.form.note')}
                value={formValues.note}
                onChange={(event) => handleChange('note', event.target.value)}
                fullWidth
                multiline
                minRows={3}
                disabled={isSubmitting}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          {t('cart.dialog.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            isSubmitting ||
            items.length === 0 ||
            !hasIdentity ||
            !hasEmail ||
            !isEmailFormatValid ||
            !isPhoneFormatValid
          }
        >
          {isSubmitting ? t('cart.actions.sending') : t('cart.dialog.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PriceRequestDialog;
