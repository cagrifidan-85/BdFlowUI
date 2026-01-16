import { Box, Grid, Modal, Typography, TextField, Button, MenuItem, Alert, AlertTitle, Snackbar } from "@mui/material";
import { useTranslation } from "react-i18next";
import styles from "./style.module.scss"
import { ProductType, ProductFiltersModel } from "@constants/index";
import { useCreateProductMutation, useUploadImageMutation } from "@apis/products";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import CheckIcon from '@mui/icons-material/Check';

interface CreateProductProps {
    filters: ProductFiltersModel
    open: boolean;
    onClose: () => void;
}

const CURRENCIES = [
    { value: 'TL', label: '₺ TL' },
    { value: 'USD', label: '$ USD' },
    { value: 'EUR', label: '€ EUR' },
    { value: 'GBP', label: '£ GBP' },
];

const CreateProduct: React.FC<CreateProductProps> = ({ filters, open, onClose }) => {
    const { t } = useTranslation()
    const lang = localStorage.getItem('currentLang');
    const [createProduct, { isLoading }] = useCreateProductMutation();
    const [uploadImage] = useUploadImageMutation();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [catalogFile, setCatalogFile] = useState<File | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState({ isOpen: false, message: "" });
    const {
        handleSubmit,
        control,
        formState,
        formState: { errors },
        reset
    } = useForm<ProductType>({
        defaultValues: undefined
    })

    const handleClose = () => {
        reset();
        setImageFile(null);
        setCatalogFile(null);
        onClose();
    }
    const uploadSingleFile = async (name:string,file: File | null) => {
        if (!file) return { url: "" };
        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", name);
        return uploadImage(formData).unwrap();
    };

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
                setShowSuccess(true);
                handleClose();
            }
        } catch (error: any) {
            const message = error?.data?.message?.toString?.() || "An error occurred";
            setShowError({ isOpen: true, message });
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
                                                    required: t('admin.products.edit.priceRequired'),
                                                    min: { value: 0, message: t('admin.products.edit.priceMin') }
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        type="number"
                                                        label={t('admin.products.create.pricePlaceholder')}
                                                        error={!!errors.price?.amount}
                                                        helperText={errors.price?.amount?.message}
                                                        inputProps={{
                                                            step: "0.01",
                                                            min: "0"
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Box>
                                        <Box flex={1}>
                                            <Controller
                                                name="price.currency"
                                                control={control}
                                                rules={{
                                                    required: t('')
                                                }

                                                }
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        select
                                                        label="Para Birimi"
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
                                                        {category[lang as 'tr' | 'en']}
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
                                                        {material[lang as 'tr' | 'en']}
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
                                                        {env[lang as 'tr' | 'en']}
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
                                                        {conn[lang as 'tr' | 'en']}
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
                                                        {elec[lang as 'tr' | 'en']}
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
                                                        {prop[lang as 'tr' | 'en']}
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
                                                        {sensor[lang as 'tr' | 'en']}
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
                                        name="catalogUrl"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                error={!!errors.catalogUrl}
                                                helperText={errors.catalogUrl?.message}
                                                fullWidth
                                                label={t('admin.products.create.catalogUrlPlaceholder')}
                                            />
                                        )}
                                    />
                                </Grid>



                                <Grid size={{ xs: 12 }}>
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
                <Snackbar
                    open={showSuccess}
                    autoHideDuration={1500}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    onClose={() => setShowSuccess(false)}
                >
                    <Alert icon={<CheckIcon fontSize="inherit" />} severity="success" onClose={() => setShowSuccess(false)}>
                        <AlertTitle>{t('admin.products.edit.successTitle')}</AlertTitle>
                        {t('admin.products.edit.successMessage')}
                    </Alert>
                </Snackbar>

                <Snackbar
                    open={showError.isOpen}
                    autoHideDuration={3000}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    onClose={() => setShowError({ isOpen: false, message: "" })}
                >
                    <Alert severity="error" onClose={() => setShowError({ isOpen: false, message: "" })}>
                        <AlertTitle>{t('admin.products.edit.errorTitle')}</AlertTitle>
                        {`${t('message')} ${showError.message}`}
                    </Alert>
                </Snackbar>
            </Box>

        </Modal >
    )
}

export default CreateProduct;