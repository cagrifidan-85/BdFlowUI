import React, { useState } from 'react';
import ProductCard from '../Product';
import { Box, Select, MenuItem, InputLabel, FormControl, Typography } from '@mui/material';
import { ProductFiltersModel, ProductType } from '@constants/index';
import styles from './style.module.scss';
import { useTranslation } from "react-i18next";
import ProductDetailModal from './ProductDetailModal';
import noDataImage from '@images/noData.png';

type SortKey = 'price' | 'name' | 'bestSeller';

interface ProductListProps {
    products: ProductType[]
    filters?:ProductFiltersModel 
    onAddToCart?: (product: ProductType) => void
}

const ProductList: React.FC<ProductListProps> = ({ products, filters, onAddToCart }) => {
    const { t } = useTranslation();
    const [sortKey, setSortKey] = useState<SortKey>('name');
    const [selectedProduct, setSelectedProduct] = useState<ProductType | undefined>(undefined);

    const [isOpenDetailModal, setIsOpenDetailModal] = useState<boolean>(false);
    const sortedProducts = [...products].sort((a, b) => {
        if (sortKey === 'price') return (a?.price?.amount ?? 0) - (b?.price?.amount ?? 0);
        if (sortKey === 'name') return a.name.localeCompare(b.name);
        if (sortKey === 'bestSeller') return (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0);
        return 0;
    })

    const handleDetailClick = (data: ProductType) => {
        setSelectedProduct(data)
        setIsOpenDetailModal(true);
    }

    return (

        <Box className={styles.productList}>
            <Box className={styles.productList__filter}>
                <Typography variant="h6" fontWeight="bold">{t('products.label')} {` ( ${products.length} )`} </Typography>
                <FormControl className={styles.productList__filterControl} size="small">
                    <InputLabel id="sort-label">{t('order.products')}</InputLabel>
                    <Select
                        labelId="sort-label"
                        value={sortKey}
                        label={t('order.products')}
                        onChange={e => setSortKey(e.target.value as SortKey)}
                    >
                        <MenuItem value="name">{t('order.name')}</MenuItem>
                        <MenuItem value="price">{t('order.price')}</MenuItem>
                        <MenuItem value="bestSeller">{t('order.mostPopular')}</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box className={styles.productList__items}>
                {sortedProducts.length > 0 ? sortedProducts.map((product, idx) => (
                    <ProductCard 
                        key={product.name + idx} 
                        product={product} 
                        onDetails={(data) => handleDetailClick(data)} 
                        onAddToCart={onAddToCart}
                        filtersData={filters}
                    />
                )) :
                    <Box className={styles.productList__noData}>
                        <Box className={styles.productList__noDataContent}>
                            <img src={noDataImage} alt='No Data' width={120} height={200} />
                            <Typography variant='h6' color='error'>{t('productList.noData')}</Typography>
                        </Box>
                    </Box>}

            </Box>
            <ProductDetailModal open={selectedProduct !== undefined && isOpenDetailModal} onClose={() => setIsOpenDetailModal(false)} filtersData={filters} product={selectedProduct} />
        </Box>
    );
};

export default ProductList;
