import { Box, Select, IconButton, Typography, Link, FormControl, MenuItem, Alert, AlertTitle, Snackbar } from '@mui/material';
import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styles from './style.module.scss';

import ProductList from '@components/common/ProductList';
import { useTranslation } from 'react-i18next';
import { ProductType, ProductFiltersModel, FilterBaseModel } from '@constants/index';




interface ChooseProductProps {
    products?: ProductType[];
    filtersData?: ProductFiltersModel;
    onItemSelected?: (value: string) => void;
    onBack?: () => void;
    material?: string;
    environment?: string;
}



const ChooseProduct = ({ products, onItemSelected, onBack, material, environment, filtersData }: ChooseProductProps) => {
    const { t } = useTranslation();
    const lang = localStorage.getItem('currentLang')
    const [filters, setFilters] = React.useState<{ [key: string]: FilterBaseModel }>({});

    const [showError, setShowError] = React.useState(false);

    const filterLabels: { [key: string]: string } = {
        'sensors': 'Sensör Tipi',
        'connectionTypes': 'Bağlantı Tipi',
        'properties': 'Özellikler',
        'electronics': 'Elektronik',
        'materials': 'Malzeme',
        'environments': 'Ortam',
        'categories': 'Kategori',
    };

    const handleChangeFilter = (filterKey: string, selectedItem: FilterBaseModel | null) => {
        setFilters(prev => {
            const newFilters = { ...prev };
            if (selectedItem) {
                newFilters[filterKey] = selectedItem;
            } else {
                delete newFilters[filterKey];
            }
            return newFilters;
        });
    }

    const renderSelectMenu = (filterKey: string, items: FilterBaseModel[]) => {
        const currentFilter = filters[filterKey];

        return (
            <Box className={styles.chooseProduct__filterCard}>
                <Typography className={styles.chooseProduct__filterLabel}>
                    {filterLabels[filterKey]}
                </Typography>
                <FormControl size="small" className={styles.chooseProduct__filterSelect}>
                    <Select
                        value={currentFilter?.code || ''}
                        onChange={(event) => {
                            const selectedCode = event.target.value as string;
                            const selectedItem = items.find(item => item.code === selectedCode) || null;
                            handleChangeFilter(filterKey, selectedItem);
                        }}
                        displayEmpty
                        className={styles.chooseProduct__select}
                    >
                        <MenuItem value="">{t('all')}</MenuItem>
                        {items.map((item) => (
                            <MenuItem key={item.code} value={item.code}>
                                {item[lang as 'tr' | 'en']}
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
            // Eğer hiç filter seçilmemişse tüm ürünleri göster
            if (Object.keys(filters).length === 0) {
                return true;
            }
            
            // Seçilen tüm filtrelere uygun ürünleri bul
            return Object.entries(filters).every(([filterKey, filterValue]) => {
                switch(filterKey) {
                    case 'sensors':
                        return product.sensor === filterValue.code;
                    case 'connectionTypes':
                        return product.connectionType === filterValue.code;
                    case 'properties':
                        return product.properties === filterValue.code;
                    case 'electronics':
                        return product.electronics === filterValue.code;
                    case 'materials':
                        return product.material === filterValue.code;
                    case 'environments':
                        return product.environment === filterValue.code;
                    default:
                        return true;
                }
            });
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
                        {Object.keys(filters).length > 0 && (
                            <Box component="span" className={styles.chooseProduct__filterCount}>
                                {' '}
                                ({Object.keys(filters).length} {t('selected')})
                            </Box>
                        )}
                    </Box>
                    <Box className={styles.chooseProduct__selectedFilters}>
                        {material && (
                            <>
                                <Typography fontSize='1rem' fontWeight="bold" >
                                    {t('material')} :
                                </Typography>
                                <Typography variant="subtitle1" component="span" fontStyle="italic" >
                                    {filtersData?.materials?.find(m => m.code === material)?.[lang as 'tr' | 'en']}
                                </Typography>
                            </>
                        )}
                    </Box>
                    <Box className={styles.chooseProduct__selectedFilters}>
                        {environment && (
                            <>
                                <Typography fontSize='1rem' fontWeight="bold" >
                                    {t('environment')} :
                                </Typography>
                                <Typography variant="subtitle1" component="span" fontStyle="italic" >
                                    {filtersData?.environments?.find(e => e.code === environment)?.[lang as 'tr' | 'en']}
                                </Typography>
                            </>
                        )}
                    </Box>
                    <Link variant="body2" component="span" className={styles.chooseProduct__clearFilter} onClick={() => setFilters({})}>
                        {t('clear')}
                    </Link>
                </Box>
                <Box className={styles.chooseProduct__filters}>
                    {filtersData?.sensors && renderSelectMenu('sensors', filtersData.sensors)}
                    {filtersData?.connectionTypes && renderSelectMenu('connectionTypes', filtersData.connectionTypes)}
                    {filtersData?.properties && renderSelectMenu('properties', filtersData.properties)}
                    {filtersData?.electronics && renderSelectMenu('electronics', filtersData.electronics)}
                    {filtersData?.materials && renderSelectMenu('materials', filtersData.materials)}
                    {filtersData?.environments && renderSelectMenu('environments', filtersData.environments)}
                </Box>
            </Box>

            {filteredProducts && (
                <ProductList
                    filters={filtersData}
                    products={filteredProducts.filter(item =>
                        item.material === material && item.environment === environment
                    )}
                />
            )}

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
