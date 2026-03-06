import { render, fireEvent } from "@testing-library/react";
import CreateProduct from "./index";
import { ProductFiltersModel } from "@constants/index";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock("@components/common/ResultModal/useGetResultContext", () => ({
  useGetResultContext: () => ({
    isOpenSnackBar: true,
    isSuccess: false,
    message: "",
    setResultContent: jest.fn(),
    closeSnackbar: jest.fn(),
  }),
}));

jest.mock("@components/admin/hooks", () => ({
  useUploadFile: () => ({ uploadSingleFile: jest.fn(), isUploading: false }),
}));

jest.mock("@apis/products", () => ({
  useCreateProductMutation: () => [jest.fn(), { isLoading: false }],
}));

const filters: ProductFiltersModel = {
  categories: [{ code: "cat", en: "Cat", tr: "Kategori" }],
  materials: [{ code: "mat", en: "Mat", tr: "Malzeme" }],
  environments: [{ code: "env", en: "Env", tr: "Ortam" }],
  connectionTypes: [{ code: "conn", en: "Conn", tr: "Baglanti" }],
  electronics: [{ code: "elec", en: "Elec", tr: "Elektronik" }],
  properties: [{ code: "prop", en: "Prop", tr: "Ozellik" }],
  sensors: [{ code: "sens", en: "Sens", tr: "Sensor" }],
};

describe("CreateProduct", () => {
  beforeEach(() => {
    localStorage.setItem("currentLang", "en");
  });

  test("save button is disabled initially", () => {
    const { getByText } = render(<CreateProduct filters={filters} open onClose={jest.fn()} />);

    expect(getByText("save")).toBeDisabled();
  });

  test("currency select enables when price amount is set", () => {
    const { getByLabelText } = render(<CreateProduct filters={filters} open onClose={jest.fn()} />);

    const priceInput = getByLabelText("admin.products.create.pricePlaceholder");
    const currencySelect = getByLabelText("Para Birimi");

    expect(currencySelect).toHaveAttribute("aria-disabled", "true");

    fireEvent.change(priceInput, { target: { value: "100" } });

    expect(currencySelect).not.toHaveAttribute("aria-disabled", "true");
  });
});
