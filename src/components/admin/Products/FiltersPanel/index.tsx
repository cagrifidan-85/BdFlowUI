import { useMemo, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Box,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
import styles from './style.module.scss';
import {
  FilterBaseModel,
  PRODUCT_FILTER_GROUPS,
  ProductFilterGroup,
  ProductFiltersModel,
} from '@constants/index';
import {
  useCreateFilterOptionMutation,
  useDeleteFilterOptionMutation,
} from '@apis/products';

interface FiltersPanelProps {
  filters?: ProductFiltersModel;
  isLoading?: boolean;
}

type ToastState = { type: 'success' | 'error'; message: string } | null;

type FormState = {
  code: string;
  tr: string;
  en: string;
};

const FORM_DEFAULTS: FormState = {
  code: '',
  tr: '',
  en: '',
};

const FiltersPanel = ({ filters, isLoading }: FiltersPanelProps) => {
  const { t } = useTranslation();
  const [dialogState, setDialogState] = useState<{ open: boolean; group: ProductFilterGroup | null }>({
    open: false,
    group: null,
  });
  const [formValues, setFormValues] = useState<FormState>(FORM_DEFAULTS);
  const [toast, setToast] = useState<ToastState>(null);
  const [createFilter, { isLoading: isSaving }] = useCreateFilterOptionMutation();
  const [deleteFilter, { isLoading: isDeleting }] = useDeleteFilterOptionMutation();

  const groupLabelMap: Record<ProductFilterGroup, string> = {
    categories: t('admin.products.category'),
    materials: t('admin.products.edit.materialLabel'),
    environments: t('admin.products.edit.environmentLabel'),
    sensors: t('admin.products.edit.sensorLabel'),
    connectionTypes: t('admin.products.edit.connectionTypeLabel'),
    properties: t('admin.products.edit.propertiesLabel'),
    electronics: t('admin.products.edit.electronicsLabel'),
  };

  const sortedGroups = PRODUCT_FILTER_GROUPS;

  const handleOpenDialog = (group: ProductFilterGroup) => {
    setDialogState({ open: true, group });
    setFormValues(FORM_DEFAULTS);
  };

  const handleCloseDialog = () => {
    setDialogState({ open: false, group: null });
    setFormValues(FORM_DEFAULTS);
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreate = async () => {
    if (!dialogState.group) {
      return;
    }

    const payload = {
      code: formValues.code.trim(),
      tr: formValues.tr.trim(),
      en: formValues.en.trim(),
    };

    if (!payload.code || !payload.tr || !payload.en) {
      return;
    }

    try {
      await createFilter({ group: dialogState.group, ...payload }).unwrap();
      setToast({ type: 'success', message: t('admin.filters.success') });
      handleCloseDialog();
    } catch (error) {
      console.error('[FiltersPanel] createFilter failed', error);
      setToast({ type: 'error', message: t('admin.filters.error.generic') });
    }
  };

  const handleDelete = async (group: ProductFilterGroup, code: string) => {
    const confirmed = window.confirm(t('admin.filters.delete.confirm'));
    if (!confirmed) {
      return;
    }

    try {
      await deleteFilter({ group, code }).unwrap();
      setToast({ type: 'success', message: t('admin.filters.deleteSuccess') });
    } catch (error) {
      console.error('[FiltersPanel] deleteFilter failed', error);
      setToast({ type: 'error', message: t('admin.filters.deleteError') });
    }
  };

  const currentGroupLabel = dialogState.group ? groupLabelMap[dialogState.group] : '';
  const isFormValid = useMemo(() => {
    return Boolean(formValues.code.trim() && formValues.tr.trim() && formValues.en.trim());
  }, [formValues]);

  return (
    <Box className={styles.filtersPanel}>
      <Box className={styles.filtersPanel__header}>
        <Box>
          <Typography variant="h5">{t('admin.filters.panel.title')}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t('admin.filters.panel.description')}
          </Typography>
        </Box>
      </Box>

      {isLoading && <LinearProgress className={styles.filtersPanel__progress} />}

      <Box className={styles.filtersPanel__accordions}>
        {sortedGroups.map((groupKey) => {
          const entries: FilterBaseModel[] = [...(filters?.[groupKey] || [])].sort((a, b) =>
            a.code.localeCompare(b.code, undefined, { sensitivity: 'base' }),
          );

          return (
            <Accordion key={groupKey} defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box className={styles.filtersPanel__summary}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {groupLabelMap[groupKey]}
                  </Typography>
                  <Chip label={entries.length} size="small" color="primary" variant="outlined" />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box className={styles.filtersPanel__actionsRow}>
                  <Typography variant="body2" color="text.secondary">
                    {t('admin.filters.group.helper')}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog(groupKey)}
                  >
                    {t('admin.filters.add')}
                  </Button>
                </Box>

                {entries.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" className={styles.filtersPanel__empty}>
                    {t('admin.filters.empty')}
                  </Typography>
                ) : (
                  <Box className={styles.filtersPanel__tableWrapper}>
                    <Table size="small" stickyHeader className={styles.filtersPanel__table}>
                      <TableHead>
                        <TableRow>
                          <TableCell width="20%">{t('admin.filters.code')}</TableCell>
                          <TableCell width="35%">{t('admin.filters.tr')}</TableCell>
                          <TableCell width="35%">{t('admin.filters.en')}</TableCell>
                          <TableCell width="10%" align="right">
                            {t('admin.filters.actions', { defaultValue: 'Actions' })}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {entries.map((entry) => (
                          <TableRow key={entry.code} hover>
                            <TableCell>
                              <Chip label={entry.code} size="small" />
                            </TableCell>
                            <TableCell>
                              <Typography variant="subtitle2" fontWeight={600}>
                                {entry.tr}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {entry.en}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(groupKey, entry.code)}
                                disabled={isDeleting}
                                aria-label={t('admin.filters.delete')}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>

      <Dialog open={dialogState.open} onClose={handleCloseDialog} fullWidth maxWidth="xs">
        <DialogTitle>
          {t('admin.filters.dialog.title', { label: currentGroupLabel })}
        </DialogTitle>
        <DialogContent dividers className={styles.filtersPanel__dialogContent}>
          <TextField
            label={t('admin.filters.code')}
            value={formValues.code}
            onChange={(event) => handleChange('code', event.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label={t('admin.filters.tr')}
            value={formValues.tr}
            onChange={(event) => handleChange('tr', event.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label={t('admin.filters.en')}
            value={formValues.en}
            onChange={(event) => handleChange('en', event.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={isSaving}>
            {t('admin.filters.dialog.cancel')}
          </Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            disabled={!isFormValid || isSaving}
          >
            {t('admin.filters.dialog.save')}
          </Button>
        </DialogActions>
      </Dialog>

      {toast && (
        <Snackbar
          open
          autoHideDuration={3000}
          onClose={() => setToast(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={toast.type}>{toast.message}</Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default FiltersPanel;
