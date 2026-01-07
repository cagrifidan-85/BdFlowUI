import { Box, Typography, Button, Card, CardContent, CardMedia } from '@mui/material'
import React from 'react'
import styles from './style.module.scss'
import { useTranslation } from 'react-i18next';



interface ProductCardProps {
  name: string;
  type: string;
  image: string;
  measurementRange: string;
  description: string;
  price: number;
  onAddToCart?: () => void;
  onDetails?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  type,
  image,
  measurementRange,
  description,
  price,
  onAddToCart,
  onDetails
}) => {

  const { t } = useTranslation();
  return (
    <Card className={styles.product}>
      <CardMedia
        component="img"
        image={image}
        alt={name}
        className={styles.product__image}
        sx={{ objectFit: 'contain',alignSelf: 'center', mt: 2 }}
      />
      <CardContent  className={styles.product__content}>
        <Typography variant="h6" className={styles.product__contentName}>{name}</Typography>
        <Typography variant="subtitle2" className={styles.product__contentType}>{type}</Typography>
        <Typography variant="body2" className={styles.product__contentRange}>Ölçüm Aralığı: {measurementRange}</Typography>
        <Typography variant="body2" className={styles.product__contentDescription}>{description}</Typography>
        <Typography variant="h6" color="primary" className={styles.product__contentPrice}>{price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button variant="outlined" color="info" onClick={onDetails}>{t('product.details')}</Button>
          <Button variant="contained" color="success" onClick={onAddToCart}>{t('product.addToCart')}</Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
