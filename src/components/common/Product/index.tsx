import { Box, Typography, Button, Card, CardContent, CardMedia, Chip } from '@mui/material'
import React from 'react'
import styles from './style.module.scss'
import { useTranslation } from 'react-i18next';
import { FilterBaseModel, ProductFiltersModel, ProductType } from '@constants/index';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CategoryIcon from '@mui/icons-material/Category';
import BalanceIcon from '@mui/icons-material/Balance';
import InventoryIcon from '@mui/icons-material/Inventory';



interface ProductCardProps {
  product: ProductType
  filtersData?:ProductFiltersModel
  onAddToCart?: () => void;
  onDetails?: (product: ProductType) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  filtersData,
  onAddToCart,
  onDetails
}) => {

  const { t } = useTranslation();
  const lang = localStorage.getItem("currentLang");
  
  const categoryLabel = product.category 
    ? filtersData?.categories?.filter((category: FilterBaseModel) => category.code === product.category)[0]?.[lang as 'tr' | 'en'] ?? '' 
    : '';
  
  const stockStatus = (product?.stock ?? 0) > 0 ? 'In Stock' : 'Out of Stock';
  const stockColor = (product?.stock ?? 0) > 0 ? 'success' : 'error';

  return (
      <Card className={styles.product}>
      <CardMedia
        component="img"
        image={product.image}
        alt={product.name}
        className={styles.product__image}
      />
        <CardContent className={styles.product__content}>
        {/* Başlık */}
          <Typography variant="h6" className={styles.product__contentName}>
          {product.name}
        </Typography>

        {/* Kategori Chip */}
        {categoryLabel && (
            <Box className={styles.product__categoryChip}>
            <Chip
              icon={<CategoryIcon />}
              label={categoryLabel}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
        )}

          {/* Ürün Detayları - CSS Grid Layout */}
          <Box className={styles.product__detailsGrid}>
            {/* Ölçüm Aralığı */}
            <Box className={styles.measureBox}>
              <BalanceIcon className={styles.iconMeasure} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" className={styles.labelCaption}>
                  {t('admin.products.measurementRange')}
                </Typography>
                {product.measurementRange && (
                  <Typography variant="body2" className={styles.labelBodyOrange}>
                    {product.measurementRange}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Stok Durumu */}
            <Box className={`${styles.stockBox} ${stockColor === 'success' ? styles.stockSuccess : styles.stockError}`}>
              <InventoryIcon className={stockColor === 'success' ? styles.iconStockSuccess : styles.iconStockError} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" className={styles.labelCaption}>
                  {t('admin.products.stock')}
                </Typography>
                <Typography variant="body2" className={stockColor === 'success' ? styles.labelBodyStockSuccess : styles.labelBodyStockError}>
                  {product.stock ?? 0} {t('admin.products.stock')}
                </Typography>
              </Box>
            </Box>
          </Box>

       

        {/* Fiyat */}
        {product.price?.amount ? (
            <Box className={styles.product__contentPrice}>
              <Box className={styles.priceBox}>
                <LocalOfferIcon className={styles.iconPrice} />
                <Box className={styles.product__contentPriceContent}>
                  <Typography variant="caption" style={{ color: '#666', fontWeight: 600, display: 'block' }}>
                  {t('admin.products.price')}
                </Typography>
                  <Typography variant="h6" className={styles.priceText}>
                    {product.price.amount.toString()} <span className={styles.priceCurrency}>{product.price.currency}</span>
                </Typography>
              </Box>
            </Box>
          </Box>
        ) : (
            <Box className={styles.priceRequestBox}>
              <Typography variant="body2" style={{ color: '#757575', fontStyle: 'italic', fontWeight: 500 }}>
              {t('price')}: {t('admin.products.ondemand')}
            </Typography>
          </Box>
        )}

        {/* Butonlar */}
          <Box className={styles.product__actions}>
          <Button 
            variant="outlined" 
            color="info" 
            size="small"
            onClick={() => onDetails && onDetails(product)}
            className={styles.btnTight}
            style={{ flex: 1 }}
          >
            {t('product.details')}
          </Button>
          <Button 
            variant="contained" 
            color="success" 
            size="small"
            onClick={onAddToCart}
            disabled={(product.stock ?? 0) === 0}
            className={styles.btnTight}
            style={{ flex: 1 }}
          >
            {t('product.addToCart')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard