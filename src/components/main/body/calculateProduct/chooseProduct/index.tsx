import { Box, Select, IconButton, Typography, Link, FormControl, MenuItem, Alert, AlertTitle, Snackbar, CircularProgress } from '@mui/material';
import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styles from './style.module.scss';
import { CategoriesType, ElectronicsTypes, EnvironmentType, FilterTypes, MaterialType, ProductType, PropertyTypes, SensorTypes } from '@constants/index';
import ProductList from '@components/common/ProductList';
import { useTranslation } from 'react-i18next';




interface ChooseProductProps {
    products?: ProductType[];
    onItemSelected?: (value: string) => void;
    onBack?: () => void;
    material?: MaterialType;
    environment?: EnvironmentType;
}



const ChooseProduct = ({ products, onItemSelected, onBack, material, environment }: ChooseProductProps) => {
    const { t } = useTranslation();
    const [filters, setFilters] = React.useState<{ filter: FilterTypes, value: string }[]>([])
 
    const [showError, setShowError] = React.useState(false);
    const handleChange = (filterType: FilterTypes, value: string) => {
        setFilters(prevFilters => {
            const filtered = prevFilters.filter(f => f.filter !== filterType);
            return [...filtered, { filter: filterType, value }];
        });
    }


    const renderSelectMenu = (filterType: FilterTypes, items: string[]) => {
        const currentFilter = filters.find(f => f.filter === filterType);
        const filterLabels: Record<FilterTypes, string> = {
            [FilterTypes.Sensors]: 'Sensör Tipi',
            [FilterTypes.ConnectionType]: 'Bağlantı Tipi',
            [FilterTypes.Properties]: 'Özellikler',
            [FilterTypes.Electronics]: 'Elektronik',
            [FilterTypes.Materials]: 'Malzeme',
            [FilterTypes.Environments]: 'Ortam',
            [FilterTypes.Categories]: 'Kategori',
        };

        return (
            <Box className={styles.chooseProduct__filterCard}>
                <Typography className={styles.chooseProduct__filterLabel}>
                    {filterLabels[filterType]}
                </Typography>
                <FormControl size="small" className={styles.chooseProduct__filterSelect}>
                    <Select
                        value={currentFilter?.value || ''}
                        onChange={(event) => handleChange(filterType, event.target.value as string)}
                        displayEmpty
                        className={styles.chooseProduct__select}
                    >
                        <MenuItem value="">{t('all')}</MenuItem>
                        {items.map((item) => (
                            <MenuItem key={item} value={item}>
                                {item}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

            </Box>
        )
    }



    // Filtreleme mantığı
    const filteredProducts = React.useMemo(() => {
        return products && products.filter(product => {
            const sensorFilter = filters.find(f => f.filter === FilterTypes.Sensors);
            const connectionFilter = filters.find(f => f.filter === FilterTypes.ConnectionType);
            const propertiesFilter = filters.find(f => f.filter === FilterTypes.Properties);
            const electronicsFilter = filters.find(f => f.filter === FilterTypes.Electronics);


            if (sensorFilter && sensorFilter.value && product.sensor !== sensorFilter.value) return false;
            if (connectionFilter && connectionFilter.value && product.connectionType !== connectionFilter.value) return false;
            if (propertiesFilter && propertiesFilter.value && product.properties !== propertiesFilter.value) return false;
            if (electronicsFilter && electronicsFilter.value && product.electronics !== electronicsFilter.value) return false;


            return true;
        })
    }, [filters, products]);

    
    return (
        <Box className={styles.chooseProduct}>
            {onBack && (
                <Box className={styles.chooseProduct__navigation}>
                    <IconButton
                        onClick={onBack}
                        className={styles.chooseProduct__navigationBtn}
                        size="large"
                    >
                        <ArrowBackIcon fontSize="large" />
                    </IconButton>
                </Box>
            )}
            <Box className={styles.chooseProduct__filtersContainer}>
                <Box className={styles.chooseProduct__filtersHeader}>
                    <Box>
                        {t('filters')}
                        {filters.length > 0 && (
                            <Box component="span" className={styles.chooseProduct__filterCount}>
                                {' '}
                                ({filters.length} {t('selected')})
                            </Box>
                        )}
                    </Box>
                    <Box className={styles.chooseProduct__selectedFilters}>
                        <Typography fontSize='1rem' fontWeight="bold" >
                            {t('material')} :
                        </Typography>
                        <Typography variant="subtitle1" component="span" fontStyle="italic" >
                            {t(`${material?.toLowerCase()}`)}
                        </Typography>
                    </Box>
                    <Box className={styles.chooseProduct__selectedFilters}>
                        <Typography fontSize='1rem' fontWeight="bold" >
                            {t('environment')} :
                        </Typography>
                        <Typography variant="subtitle1" component="span" fontStyle="italic" >
                            {t(`${environment?.toLowerCase()}`)}
                        </Typography>
                    </Box>
                    <Link variant="body2" component="span" className={styles.chooseProduct__clearFilter} onClick={() => setFilters([])}>
                        {t('clear')}
                    </Link>
                </Box>
                <Box className={styles.chooseProduct__filters}>
                    {renderSelectMenu(FilterTypes.Sensors, [...Object.values(SensorTypes)])}
                    {renderSelectMenu(FilterTypes.ConnectionType, [...Object.values(CategoriesType)])}
                    {renderSelectMenu(FilterTypes.Properties, [...Object.values(PropertyTypes)])}
                    {renderSelectMenu(FilterTypes.Electronics, [...Object.values(ElectronicsTypes)])}
                </Box>
            </Box>

            {filteredProducts && <ProductList products={filteredProducts?.filter(item => item.material === material && item.environment === environment)} />}

            <Snackbar
                open={showError}
                autoHideDuration={3000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                onClose={() => setShowError(false)}
            >
                <Alert severity="error" onClose={() => setShowError(false)}>
                    <AlertTitle>{t('admin.products.create.errorTitle')}</AlertTitle>
                    {t('admin.products.create.errorMessage')}
                </Alert>
            </Snackbar>
        </Box>
    )
}


export default ChooseProduct 
