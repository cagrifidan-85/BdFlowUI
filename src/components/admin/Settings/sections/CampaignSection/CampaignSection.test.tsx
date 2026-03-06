import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CampaignSection from "./index";
import { CampaignPopup } from "@app-types/siteSettings";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const baseCampaign: CampaignPopup = {
  enabled: true,
  title: "",
  message: "",
  ctaLabel: "",
  ctaUrl: "",
  items: [],
  visibility: {
    mode: "always",
    segments: [],
    startAt: null,
    endAt: null,
  },
};

const baseProps = {
  campaignPopup: baseCampaign,
  isSiteSettingsLoading: false,
  isSettingsBusy: false,
  onToggle: jest.fn(),
  onAddItem: jest.fn(),
  onRemoveItem: jest.fn(),
  onItemChange: jest.fn(() => jest.fn()),
  onVisibilityModeChange: jest.fn(),
  onVisibilitySegmentsChange: jest.fn(),
  onScheduleChange: jest.fn(() => jest.fn()),
  onSave: jest.fn(),
  formatSegments: (segments: string[]) => segments.join(", "),
  toDateInputValue: () => null,
};

describe("CampaignSection", () => {
  test("shows empty state when there are no items", () => {
    const { getByText } = render(<CampaignSection {...baseProps} />);

    expect(getByText("admin.settings.campaign.empty")).toBeInTheDocument();
  });

  test("calls add item handler", async () => {
    const user = userEvent.setup();
    const { getByText } = render(<CampaignSection {...baseProps} />);

    await user.click(getByText("admin.settings.campaign.addItem"));
    expect(baseProps.onAddItem).toHaveBeenCalledTimes(1);
  });

  test("renders segments input when visibility mode is segments", () => {
    const { getByLabelText } = render(
      <CampaignSection
        {...baseProps}
        campaignPopup={{
          ...baseCampaign,
          visibility: {
            ...baseCampaign.visibility,
            mode: "segments",
          },
        }}
      />
    );

    expect(getByLabelText("admin.settings.campaign.segmentsLabel")).toBeInTheDocument();
  });
});
