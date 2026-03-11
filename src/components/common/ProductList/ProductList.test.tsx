import { fireEvent, render } from "@testing-library/react";
import ProductList from "./index";
import { ProductType } from "@constants/index";

jest.mock("react-i18next", () => ({
  initReactI18next: { type: "3rdParty", init: () => undefined },
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock("../Product", () => (props: { product: ProductType; onDetails: (data: ProductType) => void }) => (
  <button data-testid="product-card" onClick={() => props.onDetails(props.product)}>
    {props.product.name}
  </button>
));

jest.mock("./ProductDetailModal", () => ({
  __esModule: true,
  default: ({ open }: { open: boolean }) => (open ? <div data-testid="product-detail-modal" /> : null),
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

describe("ProductList", () => {
  test("shows empty state when no products", () => {
    const { getByText } = render(<ProductList products={[]} />);
    expect(getByText("productList.noData")).toBeInTheDocument();
  });

  test("sorts by price when selected", () => {
    const products = [
      makeProduct({ id: "p-1", name: "Alpha", price: { amount: 50, currency: "TL" } }),
      makeProduct({ id: "p-2", name: "Beta", price: { amount: 10, currency: "TL" } }),
    ];

    const { getByLabelText, getByRole, getAllByTestId } = render(<ProductList products={products} />);

    fireEvent.mouseDown(getByLabelText("order.products"));
    fireEvent.click(getByRole("option", { name: "order.price" }));

    const rendered = getAllByTestId("product-card").map((el) => el.textContent);
    expect(rendered).toEqual(["Beta", "Alpha"]);
  });

  test("sorts by best seller when selected", () => {
    const products = [
      makeProduct({ id: "p-1", name: "Alpha", bestSeller: false }),
      makeProduct({ id: "p-2", name: "Beta", bestSeller: true }),
    ];

    const { getByLabelText, getByRole, getAllByTestId } = render(<ProductList products={products} />);

    fireEvent.mouseDown(getByLabelText("order.products"));
    fireEvent.click(getByRole("option", { name: "order.mostPopular" }));

    const rendered = getAllByTestId("product-card").map((el) => el.textContent);
    expect(rendered).toEqual(["Beta", "Alpha"]);
  });

  test("opens detail modal when product card clicked", () => {
    const products = [makeProduct({ id: "p-1", name: "Alpha" })];

    const { getByTestId } = render(<ProductList products={products} />);

    fireEvent.click(getByTestId("product-card"));
    expect(getByTestId("product-detail-modal")).toBeInTheDocument();
  });
});
