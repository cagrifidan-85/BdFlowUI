import { Box, Alert, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useGetFiltersQuery } from '@apis/products';
import FiltersPanel from '../Products/FiltersPanel';

const Filters = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useGetFiltersQuery();

  if (isError && !isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={320}>
        <Alert severity="error">{t('admin.filters.error.generic')}</Alert>
      </Box>
    );
  }

  if (!data && isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={320}>
        <CircularProgress />
      </Box>
    );
  }

  return <FiltersPanel filters={data} isLoading={isLoading} />;
};

export default Filters;
