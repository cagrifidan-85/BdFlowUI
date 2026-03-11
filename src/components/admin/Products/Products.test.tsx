import { fireEvent, render } from "@testing-library/react";
import Products from "./index";
import { ProductType } from "@constants/index";

jest.mock("react-i18next", () => ({
  initReactI18next: { type: "3rdParty", init: () => undefined },
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockUseGetAllProductsQuery = jest.fn();
const mockUseGetFiltersQuery = jest.fn();

jest.mock("@apis/products", () => ({
  useGetAllProductsQuery: () => mockUseGetAllProductsQuery(),
  useGetFiltersQuery: () => mockUseGetFiltersQuery(),
}));

jest.mock("./Detail", () => ({
  ProductDetail: ({ open, product }: { open: boolean; product?: ProductType }) =>
    open ? <div data-testid="product-detail">{product?.name}</div> : null,
}));

jest.mock("./Edit", () => ({
  ProductEdit: ({ open, product }: { open: boolean; product?: ProductType }) =>
    open ? <div data-testid="product-edit">{product?.name}</div> : null,
}));

jest.mock("./Create", () => ({
  __esModule: true,
  default: ({ open }: { open: boolean }) => (open ? <div data-testid="product-create" /> : null),
}));

const makeProduct = (overrides: Partial<ProductType> = {}): ProductType => ({
  id: overrides.id ?? "p-1",
  productNo: overrides.productNo ?? "P-001",
  name: overrides.name ?? "Alpha",
  image: overrides.image ?? "image.jpg",
  measurementRange: overrides.measurementRange ?? "0-10",
  description: overrides.description ?? "desc",
  price: overrides.price ?? { amount: 10, currency: "TL" },
  bestSeller: overrides.bestSeller ?? false,
  catalogUrl: overrides.catalogUrl ?? "catalog.pdf",
  material: overrides.material ?? "mat",
  environment: overrides.environment ?? "env",
  stock: overrides.stock ?? 1,
  sensor: overrides.sensor ?? "sensor",
  connectionType: overrides.connectionType ?? "conn",
  properties: overrides.properties ?? "prop",
  electronics: overrides.electronics ?? "elec",
  category: overrides.category ?? "cat",
});

describe("Admin Products", () => {
  beforeEach(() => {
    localStorage.setItem("currentLang", "en");
    mockUseGetAllProductsQuery.mockReset();
    mockUseGetFiltersQuery.mockReset();
  });

  test("shows loading state", () => {
    mockUseGetAllProductsQuery.mockReturnValue({ data: undefined, isLoading: true, isError: false });
    mockUseGetFiltersQuery.mockReturnValue({ data: undefined, isLoading: true, isError: false });

    const { getByRole } = render(<Products />);

    expect(getByRole("progressbar")).toBeInTheDocument();
  });

  test("shows error state", () => {
    mockUseGetAllProductsQuery.mockReturnValue({ data: undefined, isLoading: false, isError: true });
    mockUseGetFiltersQuery.mockReturnValue({ data: undefined, isLoading: false, isError: false });

    const { getByText } = render(<Products />);

    expect(getByText("admin.products.error.loading")).toBeInTheDocument();
  });

  test("renders product row with localized category", () => {
    mockUseGetAllProductsQuery.mockReturnValue({
      data: [makeProduct({ category: "cat-1" })],
      isLoading: false,
      isError: false,
    });
    mockUseGetFiltersQuery.mockReturnValue({
      data: {
        categories: [{ code: "cat-1", en: "Flowmeters", tr: "Debimetre" }],
      },
      isLoading: false,
      isError: false,
    });

    const { getByText } = render(<Products />);

    expect(getByText("Flowmeters")).toBeInTheDocument();
    expect(getByText("P-001")).toBeInTheDocument();
  });

  test("opens edit modal when edit icon clicked", () => {
    mockUseGetAllProductsQuery.mockReturnValue({
      data: [makeProduct({ name: "Alpha" })],
      isLoading: false,
      isError: false,
    });
    mockUseGetFiltersQuery.mockReturnValue({ data: { categories: [] }, isLoading: false, isError: false });

    const { getAllByTestId, getByTestId } = render(<Products />);

    fireEvent.click(getAllByTestId("EditNoteIcon")[0]);
    expect(getByTestId("product-edit")).toHaveTextContent("Alpha");
  });

  test("opens create modal when add new clicked", () => {
    mockUseGetAllProductsQuery.mockReturnValue({ data: [makeProduct()], isLoading: false, isError: false });
    mockUseGetFiltersQuery.mockReturnValue({ data: { categories: [] }, isLoading: false, isError: false });

    const { getByText, getByTestId } = render(<Products />);

    fireEvent.click(getByText("admin.products.addNew"));
    expect(getByTestId("product-create")).toBeInTheDocument();
  });
});
