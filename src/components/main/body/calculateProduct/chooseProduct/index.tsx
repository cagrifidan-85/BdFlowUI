import { Box, Select, IconButton, Typography, Link, FormControl, MenuItem, Snackbar, Alert } from '@mui/material';
import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styles from './style.module.scss';

import ProductList from '@components/common/ProductList';
import { useTranslation } from 'react-i18next';
import { ProductType, ProductFiltersModel, FilterBaseModel } from '@constants/index';
import FloatingCart from '@components/common/FloatingCart';
import PriceRequestDialog from '@components/common/FloatingCart/PriceRequestDialog';
import { CartItem, PriceRequestFormValues } from '@app-types/cart';
import { useSendPriceRequestMutation } from '@apis/priceRequests';
import { ResultModal } from '@components/common/ResultModal';
import { getActiveLanguage, getLocalizedProductText } from '../../../../../utils';




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
    const lang = getActiveLanguage();
    const [filters, setFilters] = React.useState<{ [key: string]: FilterBaseModel }>({});
    const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
    const [isCartCollapsed, setIsCartCollapsed] = React.useState(false);
    const [isPriceRequestOpen, setIsPriceRequestOpen] = React.useState(false);
    const [toast, setToast] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [requestResult, setRequestResult] = React.useState({
        open: false,
        isSuccess: true,
        message: '',
        isLoading: false,
    });
    const [sendPriceRequest, { isLoading: isSendingRequest }] = useSendPriceRequestMutation();
    const isCartFullyPriced = React.useMemo(
        () => cartItems.length > 0 && cartItems.every((item) => typeof item.product.price?.amount === 'number' && item.product.price.amount >= 0),
        [cartItems]
    );

    const resolveProductKey = (product: ProductType) =>
        product.id || product.productNo || product.name || product.nameEn || product.catalogUrl || product.image;
    const resolveFilterLabel = (options?: FilterBaseModel[], code?: string) => {
        if (!code || !options) {
            return undefined;
        }
        const match = options.find((item) => item.code === code);
        return match ? match[lang as 'tr' | 'en'] : undefined;
    };

    React.useEffect(() => {
        if (!cartItems.length) {
            setIsPriceRequestOpen(false);
        }
    }, [cartItems.length]);

    const showSnackbar = (type: 'success' | 'error', message: string) => {
        setToast({ type, message });
    };

    const handleAddToCart = (product: ProductType) => {
        const productKey = resolveProductKey(product);
        const materialLabelFromProduct = resolveFilterLabel(filtersData?.materials, product.material);
        const environmentLabelFromProduct = resolveFilterLabel(filtersData?.environments, product.environment);

        setCartItems((prev) => {
            const existing = prev.find((item) => item.key === productKey);
            if (existing) {
                return prev.map((item) =>
                    item.key === productKey
                        ? {
                            ...item,
                            quantity: item.quantity + 1,
                            materialLabel: item.materialLabel || materialLabelFromProduct,
                            environmentLabel: item.environmentLabel || environmentLabelFromProduct,
                        }
                        : item
                );
            }

            return [...prev, {
                product,
                quantity: 1,
                key: productKey,
                materialLabel: materialLabelFromProduct,
                environmentLabel: environmentLabelFromProduct,
            }];
        });

        setIsCartCollapsed(false);
        const localizedName = getLocalizedProductText(product, 'name', lang);
        showSnackbar('success', t('cart.messages.added', { product: localizedName }));
    };

    const handleIncrement = (itemKey: string) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.key === itemKey ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const handleDecrement = (itemKey: string) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.key === itemKey && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };

    const handleRemove = (itemKey: string) => {
        setCartItems((prev) => prev.filter((item) => item.key !== itemKey));
        showSnackbar('success', t('cart.messages.removed'));
    };

    const handleClearCart = () => {
        setCartItems([]);
        showSnackbar('success', t('cart.messages.cleared'));
    };

    const handleSubmitPriceRequest = async (values: PriceRequestFormValues) => {
        try {
            setRequestResult({
                open: true,
                isSuccess: false,
                message: t('cart.actions.sending'),
                isLoading: true,
            });
            setIsPriceRequestOpen(false);

            await sendPriceRequest({
                ...values,
                items: cartItems.map((item) => ({
                    productId: item.product.id || item.product.productNo || item.key,
                    productNo: item.product.productNo,
                    name: item.product.name,
                    quantity: item.quantity,
                    price: item.product.price,
                    materialLabel: item.materialLabel,
                    environmentLabel: item.environmentLabel,
                })),
            }).unwrap();

            setCartItems([]);
            setRequestResult({
                open: true,
                isSuccess: true,
                message: t('cart.messages.sent'),
                isLoading: false,
            });
        } catch (error) {
            setRequestResult({
                open: true,
                isSuccess: false,
                message: t('cart.messages.sendFailed'),
                isLoading: false,
            });
        }
    };

    const handleOpenPriceRequest = () => {
        if (!cartItems.length) {
            showSnackbar('error', t('cart.messages.cartEmpty'));
            return;
        }
        setIsPriceRequestOpen(true);
    };

    const filterLabelKeyMap: Record<string, string> = {
        sensors: 'chooseProduct.filters.sensors',
        connectionTypes: 'chooseProduct.filters.connectionTypes',
        properties: 'chooseProduct.filters.properties',
        electronics: 'chooseProduct.filters.electronics',
        materials: 'chooseProduct.filters.materials',
        environments: 'chooseProduct.filters.environments',
        categories: 'chooseProduct.filters.categories',
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
                    {t(filterLabelKeyMap[filterKey] || 'filters')}
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
            if (Object.keys(filters).length === 0) {
                return true;
            }

            return Object.entries(filters).every(([filterKey, filterValue]) => {
                switch (filterKey) {
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

    const hasMaterialFilter = Object.prototype.hasOwnProperty.call(filters, 'materials');
    const hasEnvironmentFilter = Object.prototype.hasOwnProperty.call(filters, 'environments');

    const shouldLockMaterial = Boolean(material && !hasMaterialFilter);
    const shouldLockEnvironment = Boolean(environment && !hasEnvironmentFilter);

    const productsToRender = React.useMemo(() => {
        if (!filteredProducts) {
            return [] as ProductType[];
        }

        return filteredProducts.filter((product) => {
            const materialMatch = shouldLockMaterial ? product.material === material : true;
            const environmentMatch = shouldLockEnvironment ? product.environment === environment : true;
            return materialMatch && environmentMatch;
        });
    }, [filteredProducts, shouldLockMaterial, shouldLockEnvironment, material, environment]);

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
                <>
                    <ProductList
                        filters={filtersData}
                        products={productsToRender}
                        onAddToCart={handleAddToCart}
                    />

                    {cartItems.length > 0 && (
                        <>
                            <FloatingCart
                                items={cartItems}
                                isCollapsed={isCartCollapsed}
                                onToggle={() => setIsCartCollapsed((prev) => !prev)}
                                onIncrement={handleIncrement}
                                onDecrement={handleDecrement}
                                onRemove={handleRemove}
                                onClear={handleClearCart}
                                onRequest={handleOpenPriceRequest}
                                isSendingRequest={isSendingRequest}
                                isFullyPriced={isCartFullyPriced}
                            />
                            <PriceRequestDialog
                                open={isPriceRequestOpen}
                                onClose={() => setIsPriceRequestOpen(false)}
                                items={cartItems}
                                onSubmit={handleSubmitPriceRequest}
                                isSubmitting={isSendingRequest}
                                isOrderMode={isCartFullyPriced}
                            />
                        </>
                    )}
                </>
            )}

            <Snackbar
                open={Boolean(toast)}
                autoHideDuration={3000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                onClose={() => setToast(null)}
            >
                {toast ? (
                    <Alert severity={toast.type} onClose={() => setToast(null)}>
                        {toast.message}
                    </Alert>
                ) : undefined}
            </Snackbar>

            <ResultModal
                open={requestResult.open}
                isSuccess={requestResult.isSuccess}
                isLoading={requestResult.isLoading}
                message={requestResult.message}
                onClose={() => setRequestResult((prev) => ({ ...prev, open: false }))}
            />
        </Box>
    )
}


export default ChooseProduct
