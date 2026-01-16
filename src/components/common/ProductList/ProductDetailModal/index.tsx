import { ProductType } from "@constants/index";
import { Box, Modal, Typography } from "@mui/material";
import styles from "./style.module.scss";
import { useTranslation } from "react-i18next";
import FilePresentIcon from '@mui/icons-material/FilePresent';

interface ProductDetailModalProps {
    open: boolean;
    product: ProductType | undefined;
    onClose: () => void;
}
const ProductDetailModal = ({ open, product, onClose }: ProductDetailModalProps) => {

    const { t } = useTranslation();

    return <Modal open={open} onClose={onClose}>
        <Box className={styles.productDetailModal}>
            <Box className={styles.productDetailModal__header}>
                <h2>{product?.name}</h2>
                <button className={styles.productDetailModal__headerCloseButton} onClick={onClose}>×</button>
            </Box>
            <Box className={styles.productDetailModal__content}>

                <Box className={styles.productDetailModal__info}>
                    <img src={product?.image} alt={product?.name} className={styles.productDetailModal__image} />
                    <p><strong>{t('type')}:</strong> {product?.category}</p>
                    <p><strong>{t('admin.products.measurementRange')}:</strong> {product?.measurementRange}</p>
                    <p><strong>{t('description')}:</strong> {product?.description}  </p>
                    <p><strong>{t('price')}</strong> {product?.price.amount.toLocaleString('tr-TR', { style: 'currency', currency: product?.price.currency })}</p>
                </Box>
                <Box className={styles.productDetailModal__contentActions} >
                    <Box className={styles.productDetailModal__contentActionsCatalog}  onClick={() => {
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