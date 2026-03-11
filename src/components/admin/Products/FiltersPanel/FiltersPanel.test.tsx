import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import FiltersPanel from './index';
import { ProductFiltersModel } from '@constants/index';

jest.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: () => undefined },
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockCreateFilter = jest.fn();
const mockDeleteFilter = jest.fn();
let mockCreateLoading = false;
let mockDeleteLoading = false;

jest.mock('@apis/products', () => ({
  useCreateFilterOptionMutation: () => [mockCreateFilter, { isLoading: mockCreateLoading }],
  useDeleteFilterOptionMutation: () => [mockDeleteFilter, { isLoading: mockDeleteLoading }],
}));

const baseFilters: ProductFiltersModel = {
  categories: [
    { code: 'cat-1', tr: 'Kategori 1', en: 'Category 1' },
    { code: 'cat-2', tr: 'Kategori 2', en: 'Category 2' },
  ],
};

const mockMutationResult = () => ({ unwrap: jest.fn().mockResolvedValue(undefined) });

describe('FiltersPanel', () => {
  beforeEach(() => {
  mockCreateLoading = false;
  mockDeleteLoading = false;
    mockCreateFilter.mockReset();
    mockDeleteFilter.mockReset();
    mockCreateFilter.mockImplementation(() => mockMutationResult());
    mockDeleteFilter.mockImplementation(() => mockMutationResult());
  });

  test('shows loading indicator when filters are fetching', () => {
    render(<FiltersPanel isLoading />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders category entries inside the table', () => {
    render(<FiltersPanel filters={baseFilters} />);

    expect(screen.getAllByRole('table')).toHaveLength(1);
    expect(screen.getByText('Kategori 1')).toBeInTheDocument();
    expect(screen.getByText('Category 2')).toBeInTheDocument();
    expect(screen.getByText('admin.filters.code')).toBeInTheDocument();
  });

  test('opens dialog and submits new filter option', async () => {
    render(<FiltersPanel filters={baseFilters} />);

    fireEvent.click(screen.getAllByText('admin.filters.add')[0]);

    fireEvent.change(screen.getByLabelText('admin.filters.code'), { target: { value: '  new-cat ' } });
    fireEvent.change(screen.getByLabelText('admin.filters.tr'), { target: { value: '  Yeni ' } });
    fireEvent.change(screen.getByLabelText('admin.filters.en'), { target: { value: '  New ' } });

    fireEvent.click(screen.getByText('admin.filters.dialog.save'));

    await waitFor(() => {
      expect(mockCreateFilter).toHaveBeenCalledWith({
        group: 'categories',
        code: 'new-cat',
        tr: 'Yeni',
        en: 'New',
      });
    });
  });

  test('deletes filter entry after confirmation', async () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
    render(<FiltersPanel filters={baseFilters} />);

    fireEvent.click(screen.getAllByLabelText('admin.filters.delete')[0]);

    await waitFor(() => {
      expect(mockDeleteFilter).toHaveBeenCalledWith({ group: 'categories', code: 'cat-1' });
    });
    expect(confirmSpy).toHaveBeenCalled();
    confirmSpy.mockRestore();
  });
});
