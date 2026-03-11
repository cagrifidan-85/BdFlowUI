import { fireEvent, render, waitFor } from '@testing-library/react';
import PriceRequestDialog from './PriceRequestDialog';
import { CartItem } from '@app-types/cart';
import { ProductType } from '@constants/index';

jest.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: () => undefined },
  useTranslation: () => ({
    t: (key: string) => key,
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

const baseItem: CartItem = {
  key: 'item-1',
  quantity: 1,
  product: makeProduct(),
};

const renderDialog = (props: Partial<React.ComponentProps<typeof PriceRequestDialog>> = {}) => {
  const defaultProps: React.ComponentProps<typeof PriceRequestDialog> = {
    open: true,
    onClose: jest.fn(),
    items: [baseItem],
    onSubmit: jest.fn(),
    isSubmitting: false,
    isOrderMode: false,
  };

  return render(<PriceRequestDialog {...defaultProps} {...props} />);
};

describe('PriceRequestDialog validation', () => {
  test('submit button remains disabled until identity and email provided', async () => {
    const { getByRole, getByLabelText } = renderDialog();
    const submit = getByRole('button', { name: 'cart.dialog.submit' }) as HTMLButtonElement;

    expect(submit).toBeDisabled();

    fireEvent.change(getByLabelText('cart.form.name'), { target: { value: 'Alice' } });
    fireEvent.change(getByLabelText('cart.form.email'), { target: { value: 'alice@example.com' } });

    await waitFor(() => expect(submit).not.toBeDisabled());
  });

  test('invalid email format keeps submit disabled', async () => {
    const { getByRole, getByLabelText } = renderDialog();
    const submit = getByRole('button', { name: 'cart.dialog.submit' }) as HTMLButtonElement;

    fireEvent.change(getByLabelText('cart.form.name'), { target: { value: 'Alice' } });
    fireEvent.change(getByLabelText('cart.form.email'), { target: { value: 'alice@' } });

    await waitFor(() => expect(submit).toBeDisabled());
  });

  test('invalid phone format disables submit until corrected', async () => {
    const { getByRole, getByLabelText } = renderDialog();
    const submit = getByRole('button', { name: 'cart.dialog.submit' }) as HTMLButtonElement;

    fireEvent.change(getByLabelText('cart.form.name'), { target: { value: 'Alice' } });
    fireEvent.change(getByLabelText('cart.form.email'), { target: { value: 'alice@example.com' } });
    await waitFor(() => expect(submit).not.toBeDisabled());

    fireEvent.change(getByLabelText('cart.form.phone'), { target: { value: '123' } });
    await waitFor(() => expect(submit).toBeDisabled());

    fireEvent.change(getByLabelText('cart.form.phone'), { target: { value: '+90 212 000 00 00' } });
    await waitFor(() => expect(submit).not.toBeDisabled());
  });

  test('calls onSubmit when form is valid and submitted', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const { getByRole, getByLabelText } = renderDialog({ onSubmit });
    const submit = getByRole('button', { name: 'cart.dialog.submit' });

    fireEvent.change(getByLabelText('cart.form.name'), { target: { value: 'Alice' } });
    fireEvent.change(getByLabelText('cart.form.email'), { target: { value: 'alice@example.com' } });
    fireEvent.change(getByLabelText('cart.form.phone'), { target: { value: '+90 212 000 00 00' } });

    await waitFor(() => expect(submit).not.toBeDisabled());

    fireEvent.click(submit);

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith({
      requesterName: 'Alice',
      companyName: '',
      email: 'alice@example.com',
      phone: '902120000000',
      note: '',
    });
  });
});
