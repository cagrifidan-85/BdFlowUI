import { fireEvent, render } from "@testing-library/react";
import ContactSection from "./index";
import { ContactContent } from "@app-types/siteSettings";

jest.mock("react-i18next", () => ({
  initReactI18next: { type: "3rdParty", init: () => undefined },
  useTranslation: () => ({ t: (key: string) => key }),
}));

const contactInfo: ContactContent = {
  email: "mail@example.com",
  phone: "+90 555 000 00 00",
  address: "Somewhere",
  facebookUrl: "",
  twitterUrl: "",
  instagramUrl: "",
  linkedinUrl: "",
};

describe("ContactSection", () => {
  test("renders fields and save button", () => {
    const onContactChange = jest.fn(() => jest.fn());
    const onSave = jest.fn();

    const { getByText } = render(
      <ContactSection
        contactInfo={contactInfo}
        isSiteSettingsLoading={false}
        isSettingsBusy={false}
        onContactChange={onContactChange}
        onSave={onSave}
      />
    );

    expect(onContactChange).toHaveBeenCalledWith("email");
    expect(onContactChange).toHaveBeenCalledWith("phone");
    expect(onContactChange).toHaveBeenCalledWith("address");
    expect(onContactChange).toHaveBeenCalledWith("facebookUrl");
    expect(onContactChange).toHaveBeenCalledWith("instagramUrl");
    expect(onContactChange).toHaveBeenCalledWith("twitterUrl");
    expect(onContactChange).toHaveBeenCalledWith("linkedinUrl");

    fireEvent.click(getByText("admin.settings.contact.save"));
    expect(onSave).toHaveBeenCalledTimes(1);
  });
});
