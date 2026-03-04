import { ChangeEvent, FC } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Dayjs } from "dayjs";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { CampaignContentItem, CampaignPopup, VisibilityMode } from "@app-types/siteSettings";
import styles from "./style.module.scss";

interface CampaignSectionProps {
  campaignPopup: CampaignPopup;
  isSiteSettingsLoading: boolean;
  isSettingsBusy: boolean;
  onToggle: (_: unknown, checked: boolean) => void;
  onAddItem: () => void;
  onRemoveItem: (itemId: string) => void;
  onItemChange: (
    itemId: string,
    field: keyof CampaignContentItem
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onVisibilityModeChange: (event: SelectChangeEvent<VisibilityMode>) => void;
  onVisibilitySegmentsChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onScheduleChange: (field: "startAt" | "endAt") => (value: Dayjs | null) => void;
  onSave: () => void;
  formatSegments: (segments: string[]) => string;
  toDateInputValue: (value?: string | null) => Dayjs | null;
}

const CampaignSection: FC<CampaignSectionProps> = ({
  campaignPopup,
  isSiteSettingsLoading,
  isSettingsBusy,
  onToggle,
  onAddItem,
  onRemoveItem,
  onItemChange,
  onVisibilityModeChange,
  onVisibilitySegmentsChange,
  onScheduleChange,
  onSave,
  formatSegments,
  toDateInputValue,
}) => {
  const { t } = useTranslation();
  const campaignItems = campaignPopup.items ?? [];
  const hasCampaignItems = campaignItems.length > 0;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card className={styles.campaignSection__card}>
      <CardHeader
        title={t("admin.settings.campaign.title")}
        subheader={t("admin.settings.campaign.subtitle")}
        action={
          <FormControlLabel
            control={
              <Switch
                color="success"
                checked={campaignPopup.enabled}
                onChange={onToggle}
                disabled={isSiteSettingsLoading}
              />
            }
            label={
              campaignPopup.enabled
                ? t("admin.settings.campaign.status.enabled")
                : t("admin.settings.campaign.status.disabled")
            }
          />
        }
      />
      <CardContent>
        <Stack spacing={3}>
          <Box className={styles.campaignSection__toolbar}>
            <Button
              variant="outlined"
              startIcon={<AddCircleOutlineIcon />}
              onClick={onAddItem}
              disabled={isSiteSettingsLoading}
            >
              {t("admin.settings.campaign.addItem")}
            </Button>
            <Tooltip title={t("admin.settings.campaign.helper") ?? ""} placement="top" arrow>
              <IconButton size="small" aria-label={t("admin.settings.campaign.helper")}>
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Box className={styles.campaignSection__list}>
            {hasCampaignItems ? (
              campaignItems.map((item) => (
                <Paper key={item.itemId} className={styles.campaignSection__itemCard} elevation={0}>
                  <Stack spacing={2}>
                    <Box className={styles.campaignSection__itemHeader}>
                      <TextField
                        fullWidth
                        label={t("admin.settings.campaign.titleLabel")}
                        value={item.title}
                        onChange={onItemChange(item.itemId, "title")}
                        disabled={isSiteSettingsLoading}
                      />
                      <Tooltip title={t("admin.settings.campaign.removeItem") ?? ""}>
                        <span>
                          <IconButton
                            color="error"
                            onClick={() => onRemoveItem(item.itemId)}
                            disabled={isSiteSettingsLoading}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>

                    <TextField
                      fullWidth
                      multiline
                      minRows={3}
                      label={t("admin.settings.campaign.messageLabel")}
                      value={item.message}
                      onChange={onItemChange(item.itemId, "message")}
                      disabled={isSiteSettingsLoading}
                    />

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label={t("admin.settings.campaign.ctaLabel")}
                          value={item.ctaLabel ?? ""}
                          onChange={onItemChange(item.itemId, "ctaLabel")}
                          disabled={isSiteSettingsLoading}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label={t("admin.settings.campaign.ctaUrl")}
                          value={item.ctaUrl ?? ""}
                          onChange={onItemChange(item.itemId, "ctaUrl")}
                          disabled={isSiteSettingsLoading}
                        />
                      </Grid>
                    </Grid>
                  </Stack>
                </Paper>
              ))
            ) : (
              <Box className={styles.campaignSection__emptyState}>
                <Typography variant="subtitle1">{t("admin.settings.campaign.empty")}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("admin.settings.campaign.emptyHelper")}
                </Typography>
              </Box>
            )}
          </Box>

          <Stack spacing={2}>
            <TextField
              select
              fullWidth
              label={t("admin.settings.campaign.visibilityMode")}
              value={campaignPopup.visibility.mode}
              onChange={(event) =>
                onVisibilityModeChange(event as unknown as SelectChangeEvent<VisibilityMode>)
              }
              disabled={isSiteSettingsLoading}
            >
              <MenuItem value="always">{t("admin.settings.campaign.visibility.always")}</MenuItem>
              <MenuItem value="segments">{t("admin.settings.campaign.visibility.segments")}</MenuItem>
              <MenuItem value="schedule">{t("admin.settings.campaign.visibility.schedule")}</MenuItem>
            </TextField>

            {campaignPopup.visibility.mode === "segments" && (
              <TextField
                fullWidth
                label={t("admin.settings.campaign.segmentsLabel")}
                value={formatSegments(campaignPopup.visibility.segments)}
                placeholder={t("admin.settings.campaign.segmentsPlaceholder")}
                onChange={onVisibilitySegmentsChange}
                disabled={isSiteSettingsLoading}
              />
            )}

            {campaignPopup.visibility.mode === "schedule" && (
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <DateTimePicker
                    label={t("admin.settings.campaign.startLabel")}
                    value={toDateInputValue(campaignPopup.visibility.startAt)}
                    onChange={onScheduleChange("startAt")}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        disabled: isSiteSettingsLoading,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <DateTimePicker
                    label={t("admin.settings.campaign.endLabel")}
                    value={toDateInputValue(campaignPopup.visibility.endAt)}
                    onChange={onScheduleChange("endAt")}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        disabled: isSiteSettingsLoading,
                      },
                    }}
                  />
                </Grid>
              </Grid>
            )}
          </Stack>
        </Stack>
      </CardContent>
        <CardActions className={styles.campaignSection__actions}>
          <Button variant="contained" onClick={onSave} disabled={isSiteSettingsLoading || isSettingsBusy}>
            {t("admin.settings.campaign.save")}
          </Button>
        </CardActions>
      </Card>
    </LocalizationProvider>
  );
};

export default CampaignSection;
