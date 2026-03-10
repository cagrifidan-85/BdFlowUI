import { render, fireEvent } from '@testing-library/react';
import FloatingCart from './index';
import { CartItem } from '@app-types/cart';
import { ProductType } from '@constants/index';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, unknown>) =>
      params && Object.prototype.hasOwnProperty.call(params, 'count')
        ? `${key}:${(params.count as number).toString()}`
        : key,
  }),
}));

const makeProduct = (overrides: Partial<ProductType> = {}): ProductType => ({
  id: overrides.id ?? 'prod-1',
  productNo: overrides.productNo ?? 'P-001',
  name: overrides.name ?? 'Alpha',
  image: overrides.image ?? 'alpha.png',
  measurementRange: overrides.measurementRange ?? '0-10',
  description: overrides.description ?? 'desc',
  price: overrides.price ?? { amount: 10, currency: 'TL' },
  bestSeller: overrides.bestSeller ?? false,
  catalogUrl: overrides.catalogUrl ?? 'catalog.pdf',
  material: overrides.material ?? 'mat',
  environment: overrides.environment ?? 'env',
  stock: overrides.stock ?? 1,
  sensor: overrides.sensor ?? 'sensor',
  connectionType: overrides.connectionType ?? 'conn',
  properties: overrides.properties ?? 'prop',
  electronics: overrides.electronics ?? 'elec',
  category: overrides.category ?? 'cat',
});

const makeItem = (overrides: Partial<CartItem> = {}): CartItem => ({
  key: overrides.key ?? 'item-1',
  quantity: overrides.quantity ?? 1,
  product: overrides.product ?? makeProduct(),
  materialLabel: overrides.materialLabel,
  environmentLabel: overrides.environmentLabel,
});

const baseProps = () => ({
  items: [makeItem()],
  isCollapsed: false,
  onToggle: jest.fn(),
  onIncrement: jest.fn(),
  onDecrement: jest.fn(),
  onRemove: jest.fn(),
  onClear: jest.fn(),
  onRequest: jest.fn(),
  isSendingRequest: false,
  isFullyPriced: false,
});

describe('FloatingCart', () => {
  test('renders empty state when no items', () => {
    const props = baseProps();
    props.items = [];
    const { getByText, getByTestId } = render(<FloatingCart {...props} />);

    expect(getByText('cart.empty')).toBeInTheDocument();
    expect(getByTestId('cart-request')).toBeDisabled();
  });

  test('shows totals and order labels when fully priced', () => {
    const props = baseProps();
    props.isFullyPriced = true;
    props.items = [
      makeItem({ key: 'item-1', quantity: 1, product: makeProduct({ price: { amount: 10, currency: 'TL' } }) }),
      makeItem({ key: 'item-2', quantity: 2, product: makeProduct({ id: 'prod-2', name: 'Beta', price: { amount: 5, currency: 'TL' } }) }),
    ];

    const { getByText } = render(<FloatingCart {...props} />);

    expect(getByText('cart.total')).toBeInTheDocument();
    expect(getByText('cart.actions.submitOrder')).toBeInTheDocument();
    expect(getByText('20.00 TL')).toBeInTheDocument();
  });

  test('invokes callbacks for cart actions', () => {
    const props = baseProps();
    props.items = [makeItem({ quantity: 2 })];
    const { getByTestId } = render(<FloatingCart {...props} />);

    fireEvent.click(getByTestId('cart-increment-item-1'));
    expect(props.onIncrement).toHaveBeenCalledWith('item-1');

    fireEvent.click(getByTestId('cart-decrement-item-1'));
    expect(props.onDecrement).toHaveBeenCalledWith('item-1');

    fireEvent.click(getByTestId('cart-remove-item-1'));
    expect(props.onRemove).toHaveBeenCalledWith('item-1');

    fireEvent.click(getByTestId('cart-request'));
    expect(props.onRequest).toHaveBeenCalledTimes(1);

    fireEvent.click(getByTestId('cart-clear'));
    expect(props.onClear).toHaveBeenCalledTimes(1);
  });
});
