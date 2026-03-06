import { render } from "@testing-library/react";
import { ProductEdit } from "./index";
import { ProductType } from "@constants/index";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock("@apis/products", () => ({
  useUpdateProductMutation: () => [jest.fn(), { isLoading: false }],
  useUploadImageMutation: () => [jest.fn(), { isLoading: false }],
}));

const product: ProductType = {
  id: "p-1",
  productNo: "P-001",
  name: "Alpha",
  image: "image.jpg",
  measurementRange: "0-10",
  description: "desc",
  price: { amount: 10, currency: "TL" },
  bestSeller: false,
  catalogUrl: "catalog.pdf",
  material: "mat",
  environment: "env",
  stock: 1,
  sensor: "sensor",
  connectionType: "conn",
  properties: "prop",
  electronics: "elec",
  category: "cat",
};

describe("ProductEdit", () => {
  beforeEach(() => {
    localStorage.setItem("currentLang", "en");
  });

  test("renders actions and currency select enabled", () => {
    const { getByText, getByLabelText } = render(
      <ProductEdit
        filters={{ categories: [{ code: "cat", en: "Cat", tr: "Kategori" }] }}
        product={product}
        open
        onClose={jest.fn()}
      />
    );

    expect(getByText("admin.products.edit.cancel")).toBeInTheDocument();
    expect(getByText("admin.products.edit.save")).toBeInTheDocument();
    expect(getByLabelText("admin.products.edit.currencyLabel")).not.toBeDisabled();
  });
});
