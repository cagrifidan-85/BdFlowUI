import { ImageItem, useDeleteImageMutation, useGetImagesByContainsQuery } from "@apis/images";
import { UpdateSiteSettingsRequest, useGetSiteSettingsQuery, useUpdateSiteSettingsMutation } from "@apis/siteSettings";
import { ResultModal } from "@components/common/ResultModal";
import { useGetResultContext } from "@components/common/ResultModal/useGetResultContext";
import { Box, Chip, Typography } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { useTranslation } from "react-i18next";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Dayjs } from "dayjs";
import {
    CampaignContentItem,
    CampaignPopup,
    ContactContent,
    DEFAULT_SITE_SETTINGS,
    NewsFeedItem,
    NewsFeedSettings,
    VisibilityMode,
} from "@app-types/siteSettings";
import { useUploadFile } from "../hooks/useUploadFile";
import SliderSection from "./sections/SliderSection";
import ContactSection from "./sections/ContactSection";
import CampaignSection from "./sections/CampaignSection";
import NewsFeedSection from "./sections/NewsFeedSection";
import { formatSegments, fromDateInputValue, parseSegmentsInput, toDateInputValue } from "./utils";
import styles from "./style.module.scss";

const Settings = () => {
    const { t } = useTranslation();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [contactInfo, setContactInfo] = useState<ContactContent>(DEFAULT_SITE_SETTINGS.contact);
    const [campaignPopup, setCampaignPopup] = useState<CampaignPopup>(DEFAULT_SITE_SETTINGS.campaignPopup);
    const [newsFeedSettings, setNewsFeedSettings] = useState<NewsFeedSettings>(DEFAULT_SITE_SETTINGS.newsFeed);
    const [replacingIds, setReplacingIds] = useState<Record<string, boolean>>({});

    const { isOpenSnackBar, setResultContent, closeSnackbar, isSuccess, message } = useGetResultContext();

    const { data: imagesData, error, isLoading, refetch } = useGetImagesByContainsQuery("slider");
    const { data: siteSettings, isLoading: isSiteSettingsLoading } = useGetSiteSettingsQuery();
    const [updateSiteSettings, { isLoading: isUpdatingSiteSettings }] = useUpdateSiteSettingsMutation();
    const { uploadSingleFile, isUploading } = useUploadFile();
    const [deleteImage, { isLoading: isDeleting }] = useDeleteImageMutation();
    const clearImageSelection = () => setImageFile(null);

    const sliderImages = useMemo(() => imagesData?.images ?? [], [imagesData]);
    const sliderTotal = imagesData?.total ?? sliderImages.length;
    const hasSliderImages = sliderImages.length > 0;
    const isSettingsBusy = isUpdatingSiteSettings;

    const heroChips = useMemo(
        () => [
            {
                id: "slider",
                label: t("admin.settings.stats.slider", { count: sliderTotal }),
                color: "primary" as const,
            },
            {
                id: "campaign",
                label: campaignPopup.enabled
                    ? t("admin.settings.stats.campaignActive")
                    : t("admin.settings.stats.campaignPaused"),
                color: campaignPopup.enabled ? ("success" as const) : ("default" as const),
            },
            {
                id: "news",
                label: newsFeedSettings.enabled
                    ? t("admin.settings.stats.newsActive")
                    : t("admin.settings.stats.newsPaused"),
                color: newsFeedSettings.enabled ? ("success" as const) : ("default" as const),
            },
        ],
        [campaignPopup.enabled, newsFeedSettings.enabled, sliderTotal, t]
    );

    const generateCampaignItemId = () =>
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : `campaign-${Date.now()}`;

    const normalizeCampaignItems = (
        items?: CampaignContentItem[],
        legacySource?: Partial<CampaignPopup>
    ): CampaignContentItem[] => {
        const ensured = (items ?? []).map((item) => ({
            itemId: item.itemId || generateCampaignItemId(),
            title: item.title ?? "",
            message: item.message ?? "",
            ctaLabel: item.ctaLabel ?? "",
            ctaUrl: item.ctaUrl ?? "",
        }));

        if (ensured.length) {
            return ensured;
        }

        const legacyTitle = legacySource?.title ?? "";
        const legacyMessage = legacySource?.message ?? "";
        const legacyCtaLabel = legacySource?.ctaLabel ?? "";
        const legacyCtaUrl = legacySource?.ctaUrl ?? "";

        if (legacyTitle || legacyMessage || legacyCtaLabel || legacyCtaUrl) {
            return [
                {
                    itemId: generateCampaignItemId(),
                    title: legacyTitle,
                    message: legacyMessage,
                    ctaLabel: legacyCtaLabel,
                    ctaUrl: legacyCtaUrl,
                },
            ];
        }

        return ensured;
    };

    const generateNewsItemId = () =>
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : `news-${Date.now()}`;

    useEffect(() => {
        if (error) {
            setResultContent(false, t("admin.settings.sliderImages.fetchError"), true);
        }
    }, [error, setResultContent, t]);

    useEffect(() => {
        if (!siteSettings) {
            return;
        }

        setContactInfo(siteSettings.contact ?? DEFAULT_SITE_SETTINGS.contact);
        setCampaignPopup({
            ...DEFAULT_SITE_SETTINGS.campaignPopup,
            ...siteSettings.campaignPopup,
            items: normalizeCampaignItems(
                siteSettings.campaignPopup?.items,
                siteSettings.campaignPopup
            ),
            visibility: {
                ...DEFAULT_SITE_SETTINGS.campaignPopup.visibility,
                ...(siteSettings.campaignPopup?.visibility ?? {}),
            },
        });
        setNewsFeedSettings({
            ...DEFAULT_SITE_SETTINGS.newsFeed,
            ...siteSettings.newsFeed,
            items: siteSettings.newsFeed?.items ?? [],
        });
    }, [siteSettings]);

    useEffect(() => {
        if (!imageFile) {
            setImagePreview(null);
            return;
        }

        const previewUrl = URL.createObjectURL(imageFile);
        setImagePreview(previewUrl);

        return () => URL.revokeObjectURL(previewUrl);
    }, [imageFile]);

    const handleUploadImage = async () => {
        if (!imageFile) return;

        try {
            await uploadSingleFile(`slider-${Date.now()}`, imageFile);
            await refetch();
            setResultContent(true, t("admin.settings.sliderImages.uploadSuccess"), true);
            setImageFile(null);
        } catch (uploadError: any) {
            const uploadMessage = uploadError?.data?.message?.toString?.() || t("admin.settings.sliderImages.uploadError");
            setResultContent(false, uploadMessage, true);
        }
    };

    const handleDeleteImage = async (imageId: string) => {
        try {
            await deleteImage(imageId).unwrap();
            await refetch();
            setResultContent(true, t("admin.settings.sliderImages.deleteSuccess"), true);
        } catch (deleteError: any) {
            const deleteMessage = deleteError?.data?.message?.toString?.() || t("admin.settings.sliderImages.deleteError");
            setResultContent(false, deleteMessage, true);
        }
    };

    const handleReplaceImage = async (image: ImageItem, file: File | null, resetInput?: () => void) => {
        if (!file) return;

        setReplacingIds((prev) => ({ ...prev, [image.id]: true }));

        try {
            await uploadSingleFile(image.publicId || `slider-${Date.now()}`, file);
            await deleteImage(image.id).unwrap();
            await refetch();
            setResultContent(true, t("admin.settings.sliderImages.replaceSuccess"), true);
        } catch (replaceError: any) {
            const replaceMessage = replaceError?.data?.message?.toString?.() || t("admin.settings.sliderImages.replaceError");
            setResultContent(false, replaceMessage, true);
        } finally {
            resetInput?.();
            setReplacingIds((prev) => {
                const updated = { ...prev };
                delete updated[image.id];
                return updated;
            });
        }
    };

    const persistSettings = async (
        payload: UpdateSiteSettingsRequest,
        successTranslationKey: string,
        errorTranslationKey: string
    ) => {
        try {
            await updateSiteSettings(payload).unwrap();
            setResultContent(true, t(successTranslationKey), true);
        } catch (updateError: any) {
            const updateMessage = updateError?.data?.message?.toString?.() || t(errorTranslationKey);
            setResultContent(false, updateMessage, true);
        }
    };

    const handleContactChange = (field: keyof ContactContent) => (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setContactInfo((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleContactSave = () => {
        void persistSettings(
            { contact: contactInfo },
            "admin.settings.contact.success",
            "admin.settings.contact.error"
        );
    };

    const handleCampaignItemChange = (
        itemId: string,
        field: keyof CampaignContentItem
    ) => (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const value = event.target.value;
        setCampaignPopup((prev) => ({
            ...prev,
            items: (prev.items ?? []).map((item) =>
                item.itemId === itemId ? { ...item, [field]: value } : item
            ),
        }));
    };

    const handleAddCampaignItem = () => {
        const newItem: CampaignContentItem = {
            itemId: generateCampaignItemId(),
            title: "",
            message: "",
            ctaLabel: "",
            ctaUrl: "",
        };

        setCampaignPopup((prev) => ({
            ...prev,
            items: [newItem, ...(prev.items ?? [])],
        }));
    };

    const handleRemoveCampaignItem = (itemId: string) => {
        setCampaignPopup((prev) => ({
            ...prev,
            items: (prev.items ?? []).filter((item) => item.itemId !== itemId),
        }));
    };

    const handleCampaignToggle = (_: unknown, checked: boolean) => {
        setCampaignPopup((prev) => ({ ...prev, enabled: checked }));
    };

    const handleCampaignVisibilityModeChange = (
        event: SelectChangeEvent<VisibilityMode>
    ) => {
        const value = event.target.value as VisibilityMode;
        setCampaignPopup((prev) => ({
            ...prev,
            visibility: {
                ...prev.visibility,
                mode: value,
            },
        }));
    };

    const handleCampaignVisibilitySegmentsChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setCampaignPopup((prev) => ({
            ...prev,
            visibility: {
                ...prev.visibility,
                segments: parseSegmentsInput(event.target.value),
            },
        }));
    };

    const handleCampaignScheduleChange = (field: "startAt" | "endAt") => (value: Dayjs | null) => {
        setCampaignPopup((prev) => ({
            ...prev,
            visibility: {
                ...prev.visibility,
                [field]: fromDateInputValue(value),
            },
        }));
    };

    const handleCampaignSave = () => {
        void persistSettings(
            { campaignPopup },
            "admin.settings.campaign.success",
            "admin.settings.campaign.error"
        );
    };

    const handleNewsFeedToggle = (_: unknown, checked: boolean) => {
        setNewsFeedSettings((prev) => ({ ...prev, enabled: checked }));
    };

    const handleNewsItemChange = (
        itemId: string,
        field: keyof NewsFeedItem
    ) => (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const value = event.target.value;
        setNewsFeedSettings((prev) => ({
            ...prev,
            items: (prev.items ?? []).map((item) =>
                item.itemId === itemId ? { ...item, [field]: value } : item
            ),
        }));
    };

    const handleNewsItemSegmentsChange = (itemId: string) => (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setNewsFeedSettings((prev) => ({
            ...prev,
            items: (prev.items ?? []).map((item) =>
                item.itemId === itemId
                    ? { ...item, segments: parseSegmentsInput(event.target.value) }
                    : item
            ),
        }));
    };

    const handleNewsItemScheduleChange = (itemId: string, field: "startAt" | "endAt") => (value: Dayjs | null) => {
        setNewsFeedSettings((prev) => ({
            ...prev,
            items: (prev.items ?? []).map((item) =>
                item.itemId === itemId
                    ? { ...item, [field]: fromDateInputValue(value) }
                    : item
            ),
        }));
    };

    const handleNewsItemSwitch = (
        itemId: string,
        field: "visible" | "pinned"
    ) => (_: unknown, checked: boolean) => {
        setNewsFeedSettings((prev) => ({
            ...prev,
            items: (prev.items ?? []).map((item) =>
                item.itemId === itemId ? { ...item, [field]: checked } : item
            ),
        }));
    };

    const handleAddNewsItem = () => {
        const newItem: NewsFeedItem = {
            itemId: generateNewsItemId(),
            title: "",
            body: "",
            ctaLabel: "",
            ctaUrl: "",
            segments: [],
            startAt: null,
            endAt: null,
            visible: true,
            pinned: false,
        };

        setNewsFeedSettings((prev) => ({
            ...prev,
            items: [newItem, ...(prev.items ?? [])],
        }));
    };

    const handleRemoveNewsItem = (itemId: string) => {
        setNewsFeedSettings((prev) => ({
            ...prev,
            items: (prev.items ?? []).filter((item) => item.itemId !== itemId),
        }));
    };

    const handleNewsFeedSave = () => {
        void persistSettings(
            { newsFeed: newsFeedSettings },
            "admin.settings.news.success",
            "admin.settings.news.error"
        );
    };

    return (
        <Box className={styles.settings}>
            <Box className={styles.settings__hero}>
                <Box>
                    <Typography variant="h4" className={styles.settings__heroTitle}>
                        {t("admin.settings.pageTitle")}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {t("admin.settings.pageSubtitle")}
                    </Typography>
                </Box>
                <Box className={styles.settings__heroStats}>
                    {heroChips.map((chip) => (
                        <Chip
                            key={chip.id}
                            label={chip.label}
                            color={chip.color}
                            size="small"
                            className={styles.settings__heroChip}
                        />
                    ))}
                </Box>
            </Box>

            <Box className={styles.settings__grid}>
                <SliderSection
                    imageFile={imageFile}
                    imagePreview={imagePreview}
                    onImageFileChange={setImageFile}
                    onUploadImage={handleUploadImage}
                    onClearImage={clearImageSelection}
                    isUploading={isUploading}
                    showFetchError={Boolean(error)}
                    isLoading={isLoading}
                    sliderImages={sliderImages}
                    hasSliderImages={hasSliderImages}
                    sliderTotal={sliderTotal}
                    replacingIds={replacingIds}
                    isDeleting={isDeleting}
                    onReplaceImage={handleReplaceImage}
                    onDeleteImage={handleDeleteImage}
                />

                <ContactSection
                    contactInfo={contactInfo}
                    isSiteSettingsLoading={isSiteSettingsLoading}
                    isSettingsBusy={isSettingsBusy}
                    onContactChange={handleContactChange}
                    onSave={handleContactSave}
                />

                <CampaignSection
                    campaignPopup={campaignPopup}
                    isSiteSettingsLoading={isSiteSettingsLoading}
                    isSettingsBusy={isSettingsBusy}
                    onToggle={handleCampaignToggle}
                    onAddItem={handleAddCampaignItem}
                    onRemoveItem={handleRemoveCampaignItem}
                    onItemChange={handleCampaignItemChange}
                    onVisibilityModeChange={handleCampaignVisibilityModeChange}
                    onVisibilitySegmentsChange={handleCampaignVisibilitySegmentsChange}
                    onScheduleChange={handleCampaignScheduleChange}
                    onSave={handleCampaignSave}
                    formatSegments={formatSegments}
                    toDateInputValue={toDateInputValue}
                />

                <NewsFeedSection
                    newsFeedSettings={newsFeedSettings}
                    isSiteSettingsLoading={isSiteSettingsLoading}
                    isSettingsBusy={isSettingsBusy}
                    onToggle={handleNewsFeedToggle}
                    onAddNewsItem={handleAddNewsItem}
                    onRemoveNewsItem={handleRemoveNewsItem}
                    onNewsItemChange={handleNewsItemChange}
                    onNewsItemSegmentsChange={handleNewsItemSegmentsChange}
                    onNewsItemScheduleChange={handleNewsItemScheduleChange}
                    onNewsItemSwitch={handleNewsItemSwitch}
                    onSave={handleNewsFeedSave}
                    formatSegments={formatSegments}
                    toDateInputValue={toDateInputValue}
                />
            </Box>

            <ResultModal open={isOpenSnackBar} isSuccess={isSuccess} onClose={closeSnackbar} message={message} />
        </Box>
    );
};

export default Settings;

