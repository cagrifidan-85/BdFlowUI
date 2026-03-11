import { render, fireEvent } from '@testing-library/react';
import ProductCard from './index';
import { ProductFiltersModel, ProductType } from '@constants/index';

jest.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: () => undefined },
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const defaultProduct: ProductType = {
  id: 'prod-1',
  productNo: 'P-001',
  name: 'Test Product',
  image: 'image.png',
  measurementRange: '0-10',
  description: 'Desc',
  price: { amount: 10, currency: 'TL' },
  bestSeller: false,
  catalogUrl: 'catalog.pdf',
  material: 'mat',
  environment: 'env',
  stock: 5,
  sensor: 'sensor',
  connectionType: 'conn',
  properties: 'prop',
  electronics: 'elec',
  category: 'cat',
};

const baseProduct = (overrides: Partial<ProductType> = {}): ProductType => ({
  ...defaultProduct,
  ...overrides,
});

describe('ProductCard', () => {
  let getItemSpy: jest.SpyInstance;

  beforeEach(() => {
    getItemSpy = jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('tr');
  });

  afterEach(() => {
    getItemSpy.mockRestore();
  });

  test('renders category label using filters', () => {
    const filters: ProductFiltersModel = {
      categories: [
        {
          code: 'cat',
          tr: 'Kategori TR',
          en: 'Category EN',
        },
      ],
    };

    const { getByText } = render(<ProductCard product={baseProduct()} filtersData={filters} />);

    expect(getByText('Kategori TR')).toBeInTheDocument();
  });

  test('disables add to cart when out of stock', () => {
    const product = baseProduct({ stock: 0 });
    const { getByRole } = render(<ProductCard product={product} />);

    const button = getByRole('button', { name: 'product.addToCart' });
    expect(button).toBeDisabled();
  });

  test('invokes callbacks when actions pressed', () => {
    const onAdd = jest.fn();
    const onDetails = jest.fn();
    const { getByRole } = render(
      <ProductCard product={baseProduct()} onAddToCart={onAdd} onDetails={onDetails} />,
    );

    fireEvent.click(getByRole('button', { name: 'product.details' }));
    expect(onDetails).toHaveBeenCalledWith(expect.objectContaining({ id: 'prod-1' }));

    fireEvent.click(getByRole('button', { name: 'product.addToCart' }));
    expect(onAdd).toHaveBeenCalledWith(expect.objectContaining({ id: 'prod-1' }));
  });

  test('shows on-demand text when price missing', () => {
    const product = baseProduct({ price: undefined });
    const { getByText } = render(<ProductCard product={product} />);

    expect(
      getByText((content) => content.includes('admin.products.ondemand')),
    ).toBeInTheDocument();
  });
});
