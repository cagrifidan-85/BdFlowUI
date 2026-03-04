import { ChangeEvent, FC } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import { ImageItem } from "@apis/images";
import styles from "./style.module.scss";

interface SliderSectionProps {
  imageFile: File | null;
  imagePreview: string | null;
  onImageFileChange: (file: File | null) => void;
  onUploadImage: () => void;
  onClearImage: () => void;
  isUploading: boolean;
  showFetchError: boolean;
  isLoading: boolean;
  sliderImages: ImageItem[];
  hasSliderImages: boolean;
  sliderTotal: number;
  replacingIds: Record<string, boolean>;
  isDeleting: boolean;
  onReplaceImage: (image: ImageItem, file: File | null, resetInput?: () => void) => void;
  onDeleteImage: (imageId: string) => void;
}

const SliderSection: FC<SliderSectionProps> = ({
  imageFile,
  imagePreview,
  onImageFileChange,
  onUploadImage,
  onClearImage,
  isUploading,
  showFetchError,
  isLoading,
  sliderImages,
  hasSliderImages,
  sliderTotal,
  replacingIds,
  isDeleting,
  onReplaceImage,
  onDeleteImage,
}) => {
  const { t } = useTranslation();

  const handleFileInput = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onImageFileChange(file);
  };

  const renderImageCard = (image: ImageItem, index: number) => {
    const isReplacing = Boolean(replacingIds[image.id]);

    return (
      <Box key={image.id} className={styles.sliderSection__mediaCard}>
        <Typography variant="overline" className={styles.sliderSection__mediaHeading}>
          {t("admin.settings.sliderImages.itemLabel", { index: index + 1 })}
        </Typography>
        <Box className={styles.sliderSection__mediaThumbWrapper}>
          <img src={image.url} alt={image.publicId} loading="lazy" className={styles.sliderSection__mediaThumb} />
        </Box>
        <Box className={styles.sliderSection__mediaBody}>
          <Box className={styles.sliderSection__mediaButtons}>
            <Button
              component="label"
              variant="contained"
              size="small"
              startIcon={<EditIcon />}
              disabled={isReplacing}
              className={styles.sliderSection__mediaAction}
            >
              {t("admin.settings.sliderImages.actions.replace")}
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                hidden
                onChange={(event) => {
                  const inputNode = event.target;
                  const file = inputNode.files?.[0] || null;
                  onReplaceImage(image, file, () => {
                    inputNode.value = "";
                  });
                }}
              />
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<DeleteForeverIcon />}
              onClick={() => onDeleteImage(image.id)}
              disabled={isDeleting}
              className={styles.sliderSection__mediaAction}
            >
              {t("admin.settings.sliderImages.actions.delete")}
            </Button>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Card className={styles.sliderSection__card}>
      <CardHeader title={t("admin.settings.sliderImages.uploadLabel")} />
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            {t("admin.settings.sliderImages.helper")}
          </Typography>
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFileIcon />}
            className={styles.sliderSection__uploadTrigger}
          >
            {t("admin.settings.sliderImages.uploadButton")}
            <input type="file" accept="image/png,image/jpeg,image/jpg" hidden onChange={handleFileInput} />
          </Button>

          {imageFile && imagePreview && (
            <Box className={styles.sliderSection__preview}>
              <img src={imagePreview} alt={imageFile.name} className={styles.sliderSection__previewMedia} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t("admin.settings.sliderImages.selectedFile", { fileName: imageFile.name })}
                </Typography>
                <Stack direction="row" spacing={1} mt={2}>
                  <Button variant="contained" onClick={onUploadImage} disabled={isUploading}>
                    {t("admin.settings.sliderImages.uploadConfirmButton")}
                  </Button>
                  <Button variant="text" color="inherit" onClick={onClearImage}>
                    {t("admin.settings.sliderImages.previewClear")}
                  </Button>
                </Stack>
              </Box>
            </Box>
          )}

          <Divider />
          {showFetchError && <Alert severity="error">{t("admin.settings.sliderImages.fetchErrorInline")}</Alert>}

          <Box>
            <Typography variant="body2" className={styles.sliderSection__sectionTitle}>
              {hasSliderImages
                ? t("admin.settings.sliderImages.imagesFound", { count: sliderTotal })
                : t("admin.settings.sliderImages.images.notFounded")}
            </Typography>
            <Box className={styles.sliderSection__mediaGrid}>
              {isLoading &&
                Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton
                    key={`slider-skeleton-${index}`}
                    variant="rectangular"
                    className={styles.sliderSection__mediaSkeleton}
                  />
                ))}

              {!isLoading && hasSliderImages && sliderImages.map(renderImageCard)}

              {!isLoading && !hasSliderImages && (
                <Box className={styles.sliderSection__emptyState}>
                  <Avatar className={styles.sliderSection__emptyAvatar}>
                    <ImageNotSupportedIcon />
                  </Avatar>
                  <Typography variant="subtitle1">{t("admin.settings.sliderImages.empty")}</Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    {t("admin.settings.sliderImages.emptyHelper")}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SliderSection;
