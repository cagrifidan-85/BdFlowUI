import { Box, Typography, Button, Card, CardContent, CardMedia } from '@mui/material'
import React from 'react'
import styles from './style.module.scss'
import { useTranslation } from 'react-i18next';
import { ProductType } from '@constants/index';



interface ProductCardProps {
  product: ProductType
  onAddToCart?: () => void;
  onDetails?: (product: ProductType) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onDetails
}) => {

  const { t } = useTranslation();
  return (
    <Card className={styles.product}>
      <CardMedia
        component="img"
        image={product.image}
        alt={product.name}
        className={styles.product__image}
        sx={{ objectFit: 'contain', alignSelf: 'center', mt: 2 }}
      />
      <CardContent className={styles.product__content}>
        <Typography variant="h6" className={styles.product__contentName}>{product.name}</Typography>
        <Typography variant="subtitle2" className={styles.product__contentType}>{product.category}</Typography>
        <Typography variant="body2" className={styles.product__contentRange}>Ölçüm Aralığı: {product.measurementRange}</Typography>
        <Typography variant="body2" className={styles.product__contentDescription}>{product.description}</Typography>
        <Typography variant="h6" color="primary" className={styles.product__contentPrice}>{product.price.amount.toLocaleString('tr-TR', { style: 'currency', currency: product.price.currency })}</Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button variant="outlined" color="info" onClick={() => onDetails && onDetails(product)}>{t('product.details')}</Button>
          <Button variant="contained" color="success" onClick={onAddToCart}>{t('product.addToCart')}</Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
