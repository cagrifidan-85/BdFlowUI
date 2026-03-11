import { CartItem } from '@app-types/cart';
import { Box, Button, Divider, IconButton, Typography, Tooltip } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import styles from './style.module.scss';
import { getActiveLanguage, getLocalizedProductText } from '../../../utils';

interface FloatingCartProps {
  items: CartItem[];
  isCollapsed: boolean;
  onToggle: () => void;
  onIncrement: (itemKey: string) => void;
  onDecrement: (itemKey: string) => void;
  onRemove: (itemKey: string) => void;
  onClear: () => void;
  onRequest: () => void;
  isSendingRequest: boolean;
  isFullyPriced: boolean;
}

const FloatingCart: React.FC<FloatingCartProps> = ({
  items,
  isCollapsed,
  onToggle,
  onIncrement,
  onDecrement,
  onRemove,
  onClear,
  onRequest,
  isSendingRequest,
  isFullyPriced,
}) => {
  const { t } = useTranslation();
  const lang = getActiveLanguage();

  const totalQuantity = items.reduce((sum, current) => sum + current.quantity, 0);
  const priceAggregation = items.reduce(
    (acc, current) => {
      const price = current.product.price?.amount;
      if (typeof price === 'number' && price >= 0) {
        return {
          ...acc,
          total: acc.total + price * current.quantity,
          pricedCount: acc.pricedCount + 1,
        };
      }
      return acc;
    },
    { total: 0, pricedCount: 0 }
  );

  const showTotal = isFullyPriced && items.length > 0 && priceAggregation.pricedCount === items.length;
  const buttonLabel = isFullyPriced ? t('cart.actions.submitOrder') : t('cart.actions.request');
  const buttonLoadingLabel = isFullyPriced ? t('cart.actions.submittingOrder') : t('cart.actions.sending');
  const totalCurrency = items.find((item) => item.product.price?.currency)?.product.price?.currency;

  return (
    <Box className={`${styles.cart} ${isCollapsed ? styles.cartCollapsed : ''}`}>
      <Box className={styles.cart__header}>
        <Box className={styles.cart__headerTitle}>
          <ShoppingCartIcon fontSize="small" />
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              {t('cart.title')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('cart.itemCount', { count: totalQuantity })}
            </Typography>
          </Box>
        </Box>
        <Box className={styles.cart__headerActions}>
          <Tooltip title={t('cart.actions.clear')}>
            <span>
              <IconButton
                onClick={onClear}
                size="small"
                disabled={!items.length}
                data-testid="cart-clear"
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <IconButton onClick={onToggle} size="small">
            {isCollapsed ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      {!isCollapsed && (
        <>
          <Divider />

          <Box className={styles.cart__items}>
            {items.map((item) => {
              const localizedName = getLocalizedProductText(item.product, 'name', lang);
              const priceText = item.product.price?.amount
                ? `${item.product.price.amount} ${item.product.price.currency}`
                : t('cart.onDemand');

              return (
                <Box key={item.key} className={styles.cart__item}>
                  <Box className={styles.cart__itemInfo}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {localizedName}
                    </Typography>
                    {item.product.productNo && (
                      <Typography variant="caption" color="text.secondary">
                        {t('cart.productCode', { code: item.product.productNo })}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary">
                      {priceText}
                    </Typography>
                    {item.materialLabel && (
                      <Typography variant="caption" color="text.secondary">
                        {t('material')}: {item.materialLabel}
                      </Typography>
                    )}
                    {item.environmentLabel && (
                      <Typography variant="caption" color="text.secondary">
                        {t('environment')}: {item.environmentLabel}
                      </Typography>
                    )}
                  </Box>
                  <Box className={styles.cart__itemActions}>
                    <IconButton
                      size="small"
                      onClick={() => onDecrement(item.key)}
                      disabled={item.quantity <= 1}
                      data-testid={`cart-decrement-${item.key}`}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="body2" fontWeight={600}>
                      {item.quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => onIncrement(item.key)}
                      data-testid={`cart-increment-${item.key}`}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onRemove(item.key)}
                      data-testid={`cart-remove-${item.key}`}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              );
            })}
          </Box>

          {items.length === 0 && (
            <Typography variant="body2" className={styles.cart__empty}>
              {t('cart.empty')}
            </Typography>
          )}

          <Divider />

          <Box className={styles.cart__footer}>
            {showTotal && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t('cart.total')}
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {`${priceAggregation.total.toFixed(2)} ${totalCurrency || ''}`.trim()}
                </Typography>
              </Box>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={onRequest}
              disabled={!items.length || isSendingRequest}
              data-testid="cart-request"
            >
              {isSendingRequest ? buttonLoadingLabel : buttonLabel}
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default FloatingCart;
