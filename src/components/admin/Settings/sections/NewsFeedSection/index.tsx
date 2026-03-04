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
  Paper,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Dayjs } from "dayjs";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { NewsFeedItem, NewsFeedSettings } from "@app-types/siteSettings";
import styles from "./style.module.scss";

interface NewsFeedSectionProps {
  newsFeedSettings: NewsFeedSettings;
  isSiteSettingsLoading: boolean;
  isSettingsBusy: boolean;
  onToggle: (_: unknown, checked: boolean) => void;
  onAddNewsItem: () => void;
  onRemoveNewsItem: (itemId: string) => void;
  onNewsItemChange: (
    itemId: string,
    field: keyof NewsFeedItem
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onNewsItemSegmentsChange: (
    itemId: string
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onNewsItemScheduleChange: (
    itemId: string,
    field: "startAt" | "endAt"
  ) => (value: Dayjs | null) => void;
  onNewsItemSwitch: (
    itemId: string,
    field: "visible" | "pinned"
  ) => (_: unknown, checked: boolean) => void;
  onSave: () => void;
  formatSegments: (segments: string[]) => string;
  toDateInputValue: (value?: string | null) => Dayjs | null;
}

const NewsFeedSection: FC<NewsFeedSectionProps> = ({
  newsFeedSettings,
  isSiteSettingsLoading,
  isSettingsBusy,
  onToggle,
  onAddNewsItem,
  onRemoveNewsItem,
  onNewsItemChange,
  onNewsItemSegmentsChange,
  onNewsItemScheduleChange,
  onNewsItemSwitch,
  onSave,
  formatSegments,
  toDateInputValue,
}) => {
  const { t } = useTranslation();
  const newsItems = newsFeedSettings.items ?? [];
  const hasNewsItems = newsItems.length > 0;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card className={styles.newsFeedSection__card}>
      <CardHeader
        title={t("admin.settings.news.title")}
        subheader={t("admin.settings.news.subtitle")}
        action={
          <FormControlLabel
            control={
              <Switch
                color="primary"
                checked={newsFeedSettings.enabled}
                onChange={onToggle}
                disabled={isSiteSettingsLoading}
              />
            }
            label={
              newsFeedSettings.enabled
                ? t("admin.settings.news.status.enabled")
                : t("admin.settings.news.status.disabled")
            }
          />
        }
      />
      <CardContent>
        <Stack spacing={2}>
          <Box className={styles.newsFeedSection__toolbar}>
            <Button
              variant="outlined"
              startIcon={<AddCircleOutlineIcon />}
              onClick={onAddNewsItem}
              disabled={isSiteSettingsLoading}
            >
              {t("admin.settings.news.addItem")}
            </Button>
            <Tooltip title={t("admin.settings.news.helper") ?? ""} placement="top" arrow>
              <IconButton size="small" aria-label={t("admin.settings.news.helper")}>
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Box className={styles.newsFeedSection__list}>
            {hasNewsItems ? (
              newsItems.map((item) => (
                <Paper key={item.itemId} className={styles.newsFeedSection__itemCard} elevation={0}>
                  <Stack spacing={2}>
                    <Box className={styles.newsFeedSection__itemHeader}>
                      <TextField
                        fullWidth
                        label={t("admin.settings.news.itemTitle")}
                        value={item.title ?? ""}
                        onChange={onNewsItemChange(item.itemId, "title")}
                        disabled={isSiteSettingsLoading}
                      />
                      <IconButton
                        color="error"
                        onClick={() => onRemoveNewsItem(item.itemId)}
                        disabled={isSiteSettingsLoading}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Box>
                    <TextField
                      fullWidth
                      multiline
                      minRows={3}
                      label={t("admin.settings.news.itemBody")}
                      value={item.body ?? ""}
                      onChange={onNewsItemChange(item.itemId, "body")}
                      disabled={isSiteSettingsLoading}
                    />
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label={t("admin.settings.news.itemCtaLabel")}
                          value={item.ctaLabel ?? ""}
                          onChange={onNewsItemChange(item.itemId, "ctaLabel")}
                          disabled={isSiteSettingsLoading}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label={t("admin.settings.news.itemCtaUrl")}
                          value={item.ctaUrl ?? ""}
                          onChange={onNewsItemChange(item.itemId, "ctaUrl")}
                          disabled={isSiteSettingsLoading}
                        />
                      </Grid>
                    </Grid>
                    <TextField
                      fullWidth
                      label={t("admin.settings.news.itemSegments")}
                      value={formatSegments(item.segments ?? [])}
                      onChange={onNewsItemSegmentsChange(item.itemId)}
                      placeholder={t("admin.settings.news.itemSegmentsPlaceholder")}
                      disabled={isSiteSettingsLoading}
                    />

                    <Box className={styles.newsFeedSection__itemMeta}>
                      <FormControlLabel
                        control={
                          <Switch
                            size="small"
                            color="primary"
                            checked={Boolean(item.visible)}
                            onChange={onNewsItemSwitch(item.itemId, "visible")}
                            disabled={isSiteSettingsLoading}
                          />
                        }
                        label={t("admin.settings.news.itemVisible")}
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            size="small"
                            color="secondary"
                            checked={Boolean(item.pinned)}
                            onChange={onNewsItemSwitch(item.itemId, "pinned")}
                            disabled={isSiteSettingsLoading}
                          />
                        }
                        label={t("admin.settings.news.itemPinned")}
                      />
                    </Box>

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <DateTimePicker
                          label={t("admin.settings.news.itemStart")}
                          value={toDateInputValue(item.startAt)}
                          onChange={onNewsItemScheduleChange(item.itemId, "startAt")}
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
                          label={t("admin.settings.news.itemEnd")}
                          value={toDateInputValue(item.endAt)}
                          onChange={onNewsItemScheduleChange(item.itemId, "endAt")}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              disabled: isSiteSettingsLoading,
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Stack>
                </Paper>
              ))
            ) : (
              <Box className={styles.newsFeedSection__emptyState}>
                <Typography variant="subtitle1">{t("admin.settings.news.empty")}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("admin.settings.news.emptyHelper")}
                </Typography>
              </Box>
            )}
          </Box>
        </Stack>
      </CardContent>
        <CardActions className={styles.newsFeedSection__actions}>
          <Button variant="contained" onClick={onSave} disabled={isSiteSettingsLoading || isSettingsBusy}>
            {t("admin.settings.news.save")}
          </Button>
        </CardActions>
      </Card>
    </LocalizationProvider>
  );
};

export default NewsFeedSection;
