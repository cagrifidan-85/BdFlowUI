import { Box, Grid, Modal, Typography, TextField, Button, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import styles from "./style.module.scss"
import { ProductType, ProductFiltersModel, FilterBaseModel } from "@constants/index";
import { useCreateProductMutation } from "@apis/products";
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { ResultModal } from "@components/common/ResultModal";
import { useUploadFile } from "@components/admin/hooks";
import { useGetResultContext } from "@components/common/ResultModal/useGetResultContext";

interface CreateProductProps {
    filters?: ProductFiltersModel
    open: boolean;
    onClose: () => void;
}

const CURRENCIES = [
    { value: 'TL', label: '₺ TL' },
    { value: 'USD', label: '$ USD' },
    { value: 'EUR', label: '€ EUR' },
    { value: 'GBP', label: '£ GBP' },
];

const getOptionLabel = (option: FilterBaseModel) => {
    const trLabel = option.tr?.trim();
    const enLabel = option.en?.trim();

    if (trLabel && enLabel) {
        return `${trLabel} / ${enLabel}`;
    }

    return trLabel || enLabel || option.code;
};

const CreateProduct: React.FC<CreateProductProps> = ({ filters, open, onClose }) => {
    const { t } = useTranslation()
    const [createProduct, { isLoading }] = useCreateProductMutation();
    const { uploadSingleFile } = useUploadFile();

    const { isOpenSnackBar,
        isSuccess,
        message,
        setResultContent,
        closeSnackbar } = useGetResultContext();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [catalogFile, setCatalogFile] = useState<File | null>(null);
    const {
        handleSubmit,
        control,
        watch,
        setValue,
        formState,
        formState: { errors },
        reset
    } = useForm<ProductType>({
        defaultValues: undefined
    })

    const priceAmount = watch('price.amount');
    const isCurrencyDisabled = !priceAmount;

    useEffect(() => {
        if (!priceAmount || priceAmount === 0 || priceAmount < 0) {
            setValue('price.currency', '');
        }
    }, [priceAmount, setValue]);

    const handleClose = () => {
        reset();
        setImageFile(null);
        setCatalogFile(null);
        onClose();
    }

    const onSubmit = async (data: ProductType) => {
        try {
            const [imageUpload, catalogUpload] = await Promise.all([
                uploadSingleFile(data.productNo, imageFile),
                uploadSingleFile(data.productNo, catalogFile),
            ]);

            const payload: ProductType = {
                ...data,
                image: imageUpload.url || data.image,
                catalogUrl: catalogUpload.url || data.catalogUrl,
            } as ProductType;

            const res = await createProduct(payload).unwrap();
            if (res) {
                setResultContent(true, t('admin.products.create.successMessage'), true);
                handleClose();
            }
        } catch (error: any) {
            const serverMessage = error?.data?.message?.toString?.();
            const fallbackMessage = t('admin.products.create.errorMessage');
            setResultContent(false, serverMessage || fallbackMessage, true);
        }
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}

        >
            <Box>
                <Box className={styles.createProduct}>
                    <Typography variant="h5" gutterBottom className={styles.createProduct__title}>
                        {t('admin.products.create.title')}
                    </Typography>
                    <Box className={styles.createProduct__form}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name="name"
                                        control={control}
                                        rules={{ required: t('admin.products.edit.nameRequired') }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label={t('admin.products.create.productNamePlaceholder')}
                                                error={!!errors.name}
                                                helperText={errors.name?.message}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name="nameEn"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label={`${t('admin.products.create.productNamePlaceholder')} (EN)`}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name="productNo"
                                        control={control}
                                        rules={{ required: t('admin.products.edit.productNoRequired') }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label={t('admin.products.create.productNoPlaceholder')}
                                                error={!!errors.productNo}
                                                helperText={errors.productNo?.message}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box display="flex" gap={2} alignItems="flex-start">
                                        <Box flex={1}>
                                            <Controller
                                                name="price.amount"
                                                control={control}
                                                rules={{
                                                    min: {
                                                        value: 0,
                                                        message: t('admin.products.edit.priceMinError') || 'Fiyat 0\'dan küçük olamaz'
                                                    }
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        type="number"
                                                        label={t('admin.products.create.pricePlaceholder')}
                                                        error={!!errors.price?.amount}
                                                        helperText={errors.price?.amount?.message}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            field.onChange(value ? Math.max(0, Number(value)) : '');
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Box>
                                        <Box flex={1}>
                                            <Controller
                                                name="price.currency"
                                                control={control}
                                                rules={!isCurrencyDisabled ? {
                                                    required: t('admin.products.edit.currencyRequired')
                                                }
                                                    : undefined
                                                }
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        select
                                                        label={t('admin.products.edit.currencyLabel')}
                                                        disabled={isCurrencyDisabled}
                                                        error={!!errors.price?.currency}
                                                        helperText={errors.price?.currency?.message}
                                                    >
                                                        {CURRENCIES.map((currency) => (
                                                            <MenuItem key={currency.value} value={currency.value}>
                                                                {currency.label}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                )}
                                            />
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name="category"
                                        control={control}
                                        rules={{ required: t('admin.products.edit.categoryRequired') }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                select
                                                label={t('admin.products.create.categoryPlaceholder')}
                                                error={!!errors.category}
                                                helperText={errors.category?.message}
                                            >
                                                {filters?.categories?.map((category) => (
                                                    <MenuItem key={category.code} value={category.code}>
                                                        {getOptionLabel(category)}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name="material"
                                        control={control}
                                        rules={{ required: t('admin.products.edit.materialRequired') }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                select
                                                label={t('admin.products.create.materialPlaceholder')}
                                                error={!!errors.material}
                                                helperText={errors.material?.message}
                                            >
                                                {filters?.materials?.map((material) => (
                                                    <MenuItem key={material.code} value={material.code}>
                                                        {getOptionLabel(material)}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name="environment"
                                        control={control}
                                        rules={{ required: t('admin.products.edit.environmentRequired') }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                select
                                                label={t('admin.products.create.environmentPlaceholder')}
                                                error={!!errors.environment}
                                                helperText={errors.environment?.message}
                                            >
                                                {filters?.environments?.map((env) => (
                                                    <MenuItem key={env.code} value={env.code}>
                                                        {getOptionLabel(env)}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>

                                    <Controller
                                        name="connectionType"
                                        control={control}
                                        rules={{ required: t('admin.products.edit.connectionTypeRequired') }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                select
                                                label={t('admin.products.create.connectionTypePlaceholder')}
                                                error={!!errors.connectionType}
                                                helperText={errors.connectionType?.message}
                                            >
                                                {filters?.connectionTypes?.map((conn) => (
                                                    <MenuItem key={conn.code} value={conn.code}>
                                                        {getOptionLabel(conn)}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        )}
                                    />

                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name="electronics"
                                        control={control}
                                        rules={{ required: t('admin.products.edit.electronicsRequired') }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                select
                                                label={t('admin.products.create.electronicsPlaceholder')}
                                                error={!!errors.electronics}
                                                helperText={errors.electronics?.message}
                                            >
                                                {filters && filters.electronics?.map((elec) => (
                                                    <MenuItem key={elec.code} value={elec.code}>
                                                        {getOptionLabel(elec)}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name="properties"
                                        control={control}
                                        rules={{ required: t('admin.products.edit.propertiesRequired') }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                select
                                                label={t('admin.products.create.propertiesPlaceholder')}
                                                error={!!errors.properties}
                                                helperText={errors.properties?.message}
                                            >
                                                {filters && filters.properties?.map((prop) => (
                                                    <MenuItem key={prop.code} value={prop.code}>
                                                        {getOptionLabel(prop)}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name="sensor"
                                        control={control}
                                        rules={{ required: t('admin.products.edit.sensorRequired') }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                select
                                                label={t('admin.products.create.sensorPlaceholder')}
                                                error={!!errors.sensor}
                                                helperText={errors.sensor?.message}
                                            >
                                                {filters && filters.sensors?.map((sensor) => (
                                                    <MenuItem key={sensor.code} value={sensor.code}>
                                                        {getOptionLabel(sensor)}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name="description"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                multiline
                                                rows={4}
                                                label={t('admin.products.create.descriptionPlaceholder')}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name="descriptionEn"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                multiline
                                                rows={4}
                                                label={`${t('admin.products.create.descriptionPlaceholder')} (EN)`}
                                            />
                                        )}
                                    />
                                </Grid>


                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name="stock"
                                        rules={{ required: t('admin.products.edit.stockRequired') }}
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                type="number"
                                                label={t('admin.products.create.stockPlaceholder')}
                                                error={!!errors.stock}
                                                helperText={errors.stock?.message}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name="measurementRange"
                                        rules={{ required: t('admin.products.edit.measurementRangeRequired') }}
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label={t('admin.products.create.measurementRangePlaceholder')}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        {t('admin.products.create.imageLabel')}
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        fullWidth
                                    >
                                        {t('admin.products.create.uploadImage')}
                                        <input
                                            type="file"
                                            name="image"
                                            accept="image/png,image/jpeg,image/jpg"
                                            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                            hidden
                                        />
                                    </Button>
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        {t('admin.products.create.catalogUrlLabel')}
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        fullWidth
                                    >
                                        {t('admin.products.create.uploadCatalog')}
                                        <input
                                            type="file"
                                            name="catalog"
                                            accept="application/pdf"
                                            onChange={(e) => setCatalogFile(e.target.files?.[0] || null)}
                                            hidden
                                        />
                                    </Button>
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Box display="flex" gap={2} justifyContent="flex-end">
                                        <Button
                                            onClick={handleClose}
                                            variant="outlined"
                                            disabled={isLoading}
                                        >
                                            {t('cancel')}
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            disabled={isLoading || !formState.isValid}
                                        >
                                            {t('save')}
                                        </Button>
                                    </Box>
                                </Grid>

                            </Grid>

                        </form>



                    </Box>
                </Box>
                <ResultModal
                    open={isOpenSnackBar}
                    isSuccess={isSuccess}
                    onClose={closeSnackbar}
                    message={message}
                />
            </Box>

        </Modal >
    )
}

export default CreateProduct;