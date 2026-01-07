import React, { useState } from 'react';
import ProductCard from '../Product';
import { Box, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { ProductType } from '@constants/index';
import styles from './style.module.scss';
import { useTranslation } from "react-i18next";


type SortKey = 'price' | 'name' | 'bestSeller';

interface ProductListProps {
    products: ProductType[]
    onAddToCart?: () => void
    onDetails?: () => void
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
    const { t } = useTranslation();
    const [sortKey, setSortKey] = useState<SortKey>('name');

    const sortedProducts = [...products].sort((a, b) => {
        if (sortKey === 'price') return a.price - b.price;
        if (sortKey === 'name') return a.name.localeCompare(b.name);
        if (sortKey === 'bestSeller') return (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0);
        return 0;
    });

    return (
        <Box className={styles.productList}>
            <Box className={styles.productList__filter}>
                <FormControl sx={{ minWidth: 180, mb: 2 }}>
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
                {sortedProducts.map((product, idx) => (
                    <ProductCard key={product.name + idx} {...product} />
                ))}
            </Box>
        </Box>
    );
};

export default ProductList;
