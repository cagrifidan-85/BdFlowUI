import { ProductFiltersModel, ProductType } from "@constants/index"
import styles from "./style.module.scss"
import { Box, Modal, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import FilePresentIcon from '@mui/icons-material/FilePresent';
import { getActiveLanguage, getLocalizedProductText } from '../../../../utils';

interface DetailProps {
  product?: ProductType
  filters?:ProductFiltersModel 
  open: boolean
  onClose: () => void
}
const ProductDetail = ({ product, filters, open, onClose }: DetailProps) => {

  const { t } = useTranslation()
  const lang = getActiveLanguage()
  const localizedName = getLocalizedProductText(product, 'name', lang)
  const localizedDescription = getLocalizedProductText(product, 'description', lang)
  return (

    <Modal
      open={open}
      onClose={onClose}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Box className={styles.productDetail}>
        <Box className={styles.productDetail__header}>

          <h1>{t('admin.products.detailTitle')}</h1>

          <h1 onClick={onClose} style={{ cursor: 'pointer' }}> X </h1>
        </Box>
        <Box className={styles.productDetail__body}>
          <Box className={styles.productDetail__bodyFields}>

            <Box className={styles.productDetail__bodyFieldsItem}> <h4>{t('admin.products.productName')} : </h4> {localizedName} </Box>
            <Box className={styles.productDetail__bodyFieldsItem}> <h4>{t('admin.products.category')} : </h4> {product?.category ? filters?.categories?.filter((category) => category.code === product.category)[0]?.[lang as 'tr' | 'en'] ?? '' : ''} </Box>
            <Box className={styles.productDetail__bodyFieldsItem}> <h4>{t('admin.products.measurementRange')} : </h4> {product?.measurementRange} </Box>
            <Box className={styles.productDetail__bodyFieldsItemLarge} > <h4>{t('admin.products.description')} : </h4> {localizedDescription} </Box>

          </Box>
          <Box className={styles.productDetail__bodyActions}>
            {product?.image && (
              <img src={product.image} loading="lazy" alt={localizedName || 'Product'} />
            )}
            {product?.catalogUrl && (
              <Box
                className={styles.productDetail__bodyActionsCatalog}
                onClick={() => window.open(product.catalogUrl, '_blank')}
              >
                <FilePresentIcon color="primary" fontSize="large" />
                <Typography variant="caption" sx={{ mt: 1 }}>{t('admin.products.catalog')}</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

    </Modal >

  )
}
export { ProductDetail }