import { ChangeEvent, FC } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import PhoneIcon from "@mui/icons-material/Phone";
import PlaceIcon from "@mui/icons-material/Place";
import { ContactContent } from "@app-types/siteSettings";
import styles from "./style.module.scss";

interface ContactSectionProps {
  contactInfo: ContactContent;
  isSiteSettingsLoading: boolean;
  isSettingsBusy: boolean;
  onContactChange: (
    field: keyof ContactContent
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSave: () => void;
}

const ContactSection: FC<ContactSectionProps> = ({
  contactInfo,
  isSiteSettingsLoading,
  isSettingsBusy,
  onContactChange,
  onSave,
}) => {
  const { t } = useTranslation();

  return (
    <Card className={styles.contactSection__card}>
      <CardHeader
        title={t("admin.settings.contact.title")}
        subheader={t("admin.settings.contact.subtitle")}
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label={t("admin.settings.contact.emailLabel")}
              value={contactInfo.email}
              onChange={onContactChange("email")}
              disabled={isSiteSettingsLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AlternateEmailIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label={t("admin.settings.contact.phoneLabel")}
              value={contactInfo.phone}
              onChange={onContactChange("phone")}
              disabled={isSiteSettingsLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              multiline
              minRows={3}
              label={t("admin.settings.contact.addressLabel")}
              value={contactInfo.address}
              onChange={onContactChange("address")}
              disabled={isSiteSettingsLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PlaceIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions className={styles.contactSection__actions}>
        <Button
          variant="contained"
          onClick={onSave}
          className={styles.contactSection__actionsItem}
          disabled={isSiteSettingsLoading || isSettingsBusy}
        >
          {t("admin.settings.contact.save")}
        </Button>
      </CardActions>
    </Card>
  );
};

export default ContactSection;
