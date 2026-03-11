import { fireEvent, render } from "@testing-library/react";
import NewsFeedSection from "./index";
import { NewsFeedSettings } from "@app-types/siteSettings";

jest.mock("react-i18next", () => ({
  initReactI18next: { type: "3rdParty", init: () => undefined },
  useTranslation: () => ({ t: (key: string) => key }),
}));

const baseSettings: NewsFeedSettings = {
  enabled: true,
  items: [],
};

const baseProps = {
  newsFeedSettings: baseSettings,
  isSiteSettingsLoading: false,
  isSettingsBusy: false,
  onToggle: jest.fn(),
  onAddNewsItem: jest.fn(),
  onRemoveNewsItem: jest.fn(),
  onNewsItemChange: jest.fn(() => jest.fn()),
  onNewsItemSegmentsChange: jest.fn(() => jest.fn()),
  onNewsItemScheduleChange: jest.fn(() => jest.fn()),
  onNewsItemSwitch: jest.fn(() => jest.fn()),
  onSave: jest.fn(),
  formatSegments: (segments: string[]) => segments.join(", "),
  toDateInputValue: () => null,
};

describe("NewsFeedSection", () => {
  test("shows empty state when there are no items", () => {
    const { getByText } = render(<NewsFeedSection {...baseProps} />);

    expect(getByText("admin.settings.news.empty")).toBeInTheDocument();
  });

  test("calls add item handler", () => {
    const { getByText } = render(<NewsFeedSection {...baseProps} />);

    fireEvent.click(getByText("admin.settings.news.addItem"));
    expect(baseProps.onAddNewsItem).toHaveBeenCalledTimes(1);
  });

  test("renders item fields when items exist", () => {
    const { getByLabelText } = render(
      <NewsFeedSection
        {...baseProps}
        newsFeedSettings={{
          enabled: true,
          items: [
            {
              itemId: "item-1",
              title: "Hello",
              body: "Body",
              ctaLabel: "CTA",
              ctaUrl: "https://example.com",
              segments: [],
              startAt: null,
              endAt: null,
              visible: true,
              pinned: false,
            },
          ],
        }}
      />
    );

    expect(getByLabelText("admin.settings.news.itemTitle")).toBeInTheDocument();
    expect(getByLabelText("admin.settings.news.itemBody")).toBeInTheDocument();
  });
});
