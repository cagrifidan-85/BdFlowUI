import { ProductFiltersModel, ProductType } from "@constants/index";
import { Box, Modal, Typography } from "@mui/material";
import styles from "./style.module.scss";
import { useTranslation } from "react-i18next";
import FilePresentIcon from '@mui/icons-material/FilePresent';

interface ProductDetailModalProps {
    open: boolean;
    product: ProductType | undefined;
    filtersData?: ProductFiltersModel
    onClose: () => void;
}
const ProductDetailModal = ({ open, product, filtersData, onClose }: ProductDetailModalProps) => {
   
    const { t } = useTranslation();
    const lang = localStorage.getItem("currentLang");
    return <Modal open={open} onClose={onClose}>
        <Box className={styles.productDetailModal}>
            <Box className={styles.productDetailModal__header}>
                <h2>{product?.name}</h2>
                <button className={styles.productDetailModal__headerCloseButton} onClick={onClose}>×</button>
            </Box>
            <Box className={styles.productDetailModal__content}>

                <Box className={styles.productDetailModal__info}>

                    <p><strong>{t('type')}:</strong> {product?.category ? filtersData?.categories?.filter(category => category.code === product.category)[0]?.[lang as 'tr' | 'en'] ?? '' : ''}</p>
                    <p><strong>{t('admin.products.measurementRange')}:</strong> {product?.measurementRange}</p>
                    <p><strong>{t('description')}:</strong> {product?.description}  </p>
                    <p><strong>{t('price')}</strong> {product?.price ? `${product.price.amount} ${product.price.currency}` : ''}</p>
                    <p><strong>{t('admin.products.edit.materialLabel')}:</strong> {product?.material ? filtersData?.materials?.filter(material => material.code === product.material)[0]?.[lang as 'tr' | 'en'] ?? '' : ''}</p>
                    <p><strong>{t('admin.products.edit.environmentLabel')}:</strong> {product?.environment ? filtersData?.environments?.filter(environment => environment.code === product.environment)[0]?.[lang as 'tr' | 'en'] ?? '' : ''}</p>
                    <p><strong>{t('admin.products.edit.connectionTypeLabel')}:</strong> {product?.connectionType ? filtersData?.connectionTypes?.filter(connectionType => connectionType.code === product.connectionType)[0]?.[lang as 'tr' | 'en'] ?? '' : ''}</p>
                    <p><strong>{t('admin.products.edit.electronicsLabel')}:</strong> {product?.electronics ? filtersData?.electronics?.filter(electronic => electronic.code === product?.electronics)[0]?.[lang as 'tr' | 'en'] ?? '' : ''}</p>
                    <p><strong>{t('admin.products.edit.sensorLabel')}:</strong> {product?.sensor ? filtersData?.sensors?.filter(sensor => sensor.code === product.sensor)[0]?.[lang as 'tr' | 'en'] ?? '' : ''}</p>

                </Box>
                <Box className={styles.productDetailModal__contentActions} >
                   
                   <img src={product?.image} alt={product?.name} style={{ maxWidth: "300px", maxHeight: "300px" }} className={styles.productDetailModal__image} />
                    <Box className={styles.productDetailModal__contentActionsCatalog} onClick={() => {
                        if (product?.catalogUrl) {
                            window.open(product.catalogUrl, '_blank');
                        }
                    }} >


                        <FilePresentIcon color="primary" fontSize='large' />
                        <Typography variant="body2" sx={{ mt: 1 }}>{t('product.catalog')}</Typography>
                    </Box>
                    
                </Box>
            </Box>


        </Box>
    </Modal>

}
export default ProductDetailModal;