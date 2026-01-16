import { Box, Modal, TextField, Button, Grid, Typography, MenuItem, AlertTitle, Snackbar, CircularProgress, Divider } from "@mui/material"
import styles from "./style.module.scss"
import { ProductType, ProductFiltersModel } from "@constants/index"
import { useForm, Controller } from "react-hook-form"

import { useUpdateProductMutation, useUploadImageMutation } from "@apis/products"
import { useTranslation } from "react-i18next"
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import { useState } from "react";

interface ProductEditProps {
    filters: ProductFiltersModel
    product: ProductType
    open: boolean
    onClose: () => void
}

const ProductEdit = ({ filters, product, open, onClose }: ProductEditProps) => {
    const { t } = useTranslation()
    const lang = localStorage.getItem("currentLang");
    const [updateProduct, { isLoading }] = useUpdateProductMutation();
    const [uploadImage] = useUploadImageMutation();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [catalogFile, setCatalogFile] = useState<File | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState({ isOpen: false, message: '' });

    const {
        handleSubmit,
        control,
        formState: { errors },
        reset
    } = useForm<ProductType>({
        defaultValues: product
    });

    const uploadSingleFile = async (name: string, file: File | null) => {
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
                id: product.id,
                price: { amount: data.price.amount, currency: data.price.currency },
                image: imageUpload.url || data.image,
                catalogUrl: catalogUpload.url || data.catalogUrl,
            } as ProductType;

            const res = await updateProduct(payload).unwrap();
            if (res) {
                setShowSuccess(true);
                onClose();
            }
        } catch (error: any) {
            const message = (error as any)?.data?.message || t('admin.products.edit.errorMessage');
            setShowError({ isOpen: true, message });
        }
    };
console.log('catalogFile', catalogFile);
    return (
        <Modal
            open={open}
            onClose={onClose}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
            <Box className={styles.productEdit}>
                <Typography variant="h5" borderBottom={1}>
                    {t('admin.products.edit.title')}
                </Typography>
                {isLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                        <CircularProgress />
                    </Box>
                ) : (

                    <form onSubmit={handleSubmit(onSubmit)} className={styles.productEdit__form}>
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
                                            label={t('admin.products.edit.nameLabel')}
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
                                            label={t('admin.products.edit.productNoLabel')}
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
                                                    label={t('admin.products.edit.priceLabel')}
                                                    type="number"
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
                                                required: "Para birimi gerekli"
                                            }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    select
                                                    label="Para Birimi"
                                                    error={!!errors.price?.currency}
                                                    helperText={errors.price?.currency?.message}
                                                >
                                                    <MenuItem value="TL">₺ TL</MenuItem>
                                                    <MenuItem value="USD">$ USD</MenuItem>
                                                    <MenuItem value="EUR">€ EUR</MenuItem>
                                                    <MenuItem value="GBP">£ GBP</MenuItem>
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
                                            select
                                            fullWidth
                                            label={t('admin.products.edit.categoryLabel')}
                                            error={!!errors.category}
                                            helperText={errors.category?.message}
                                        >
                                            {filters && filters?.categories?.map((cat, index) => (
                                                <MenuItem key={index} value={cat.code}>
                                                    {`${cat[lang as 'tr' | 'en']}`}
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
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            fullWidth
                                            label={t('admin.products.edit.materialLabel')}
                                        >
                                            <MenuItem value="">{t('admin.products.edit.select')}</MenuItem>
                                            {filters && filters.materials?.map((mat) => (
                                                <MenuItem key={mat.code} value={mat.code}>
                                                    {`${mat[lang as 'tr' | 'en']}`}
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
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            fullWidth
                                            label={t('admin.products.edit.environmentLabel')}
                                        >
                                            <MenuItem value="">{t('admin.products.edit.select')}</MenuItem>
                                            {filters && filters?.environments?.map((env) => (
                                                <MenuItem key={env.code} value={env.code}>
                                                    {`${env[lang as 'tr' | 'en']}`}
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
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            fullWidth
                                            label={t('admin.products.edit.connectionTypeLabel')}
                                        >
                                            <MenuItem value="">{t('admin.products.edit.select')}</MenuItem>
                                            {filters && filters?.connectionTypes?.map((conn) => (
                                                <MenuItem key={conn.code} value={conn.code}>
                                                    {`${conn[lang as 'tr' | 'en']}`}
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
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            fullWidth
                                            label={t('admin.products.edit.electronicsLabel')}
                                        >
                                            <MenuItem value="">{t('admin.products.edit.select')}</MenuItem>
                                            {filters && filters.electronics?.map((elec) => (
                                                <MenuItem key={elec.code} value={elec.code}>
                                                    {`${elec[lang as 'tr' | 'en']}`}
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
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            fullWidth
                                            label={t('admin.products.edit.propertiesLabel')}
                                        >
                                            <MenuItem value="">{t('admin.products.edit.select')}</MenuItem>
                                            {filters && filters.properties?.map((prop) => (
                                                <MenuItem key={prop.code} value={prop.code}>
                                                    {`${prop[lang as 'tr' | 'en']}`}
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
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            fullWidth
                                            label={t('admin.products.edit.sensorLabel')}
                                        >
                                            <MenuItem value="">{t('admin.products.edit.select')}</MenuItem>
                                            {filters && filters.sensors?.map((sensor) => (
                                                <MenuItem key={sensor.code} value={sensor.code}>
                                                    {`${sensor[lang as 'tr' | 'en']}`}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Grid>

                            <Grid size={12}>
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label={t('admin.products.edit.descriptionLabel')}
                                            multiline
                                            rows={4}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Controller
                                    name="stock"
                                    control={control}
                                    rules={{
                                        min: { value: 0, message: t('admin.products.edit.stockMin') }
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label={t('admin.products.edit.stockLabel')}
                                            type="number"
                                            error={!!errors.stock}
                                            helperText={errors.stock?.message}
                                        />
                                    )}
                                />
                            </Grid>



                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Controller
                                    name="measurementRange"
                                    control={control}
                                    rules={{ required: t('admin.products.edit.measurementRangeRequired') }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label={t('admin.products.edit.measurementRangeLabel')}
                                            error={!!errors.measurementRange}
                                            helperText={errors.measurementRange?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    {t('admin.products.edit.imageLabel')}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    fullWidth
                                >
                                    {product.image ? (<><Typography variant="caption" paddingLeft={10}>
                                        < input type="file"
                                            name="image"
                                            accept="image/png,image/jpeg,image/jpg"
                                            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                            hidden
                                        />{imageFile?.name ? imageFile.name : product.image}</Typography>
                                    </>
                                    ) : (
                                        <Box>
                                            {t('admin.products.edit.uploadImage')}
                                            < input type="file"
                                                name="image"
                                                accept="image/png,image/jpeg,image/jpg"
                                                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                                hidden
                                            />
                                        </Box>

                                    )}

                                </Button>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    {t('admin.products.edit.catalogUrlLabel')}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    fullWidth
                                >
                                    {product.catalogUrl ? (<><Typography variant="caption" paddingLeft={10}>
                                        < input
                                            type="file"
                                            name="catalog"
                                            accept="application/pdf"
                                            onChange={(e) => setCatalogFile(e.target.files?.[0] || null)}
                                            hidden
                                        />{catalogFile?.name ? catalogFile.name : product.catalogUrl}</Typography>
                                    </>) : (
                                        <Box>


                                            {t('admin.products.edit.uploadCatalog')}
                                            <input
                                                type="file"
                                                name="catalog"
                                                accept="application/pdf"
                                                onChange={(e) => setCatalogFile(e.target.files?.[0] || null)}
                                                hidden
                                                width={20}
                                            />
                                        </Box>

                                    )}
                                </Button>
                            </Grid>

                            <Grid size={12} style={{ marginTop: '20px' }}>
                                <Box display="flex" justifyContent="flex-end" gap={2}>
                                    <Button
                                        variant="outlined"
                                        onClick={onClose}
                                        disabled={isLoading}
                                    >
                                        {t('admin.products.edit.cancel')}
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={isLoading}
                                    >
                                        {t('admin.products.edit.save')}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                )
                }

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
                    onClose={() => setShowError({ isOpen: false, message: '' })}
                >
                    <Alert severity="error" onClose={() => setShowError({ isOpen: false, message: '' })}>
                        <AlertTitle>{t('admin.products.edit.errorTitle')}</AlertTitle>
                        {showError.message}
                    </Alert>
                </Snackbar>
            </Box >
        </Modal >
    );
};

export { ProductEdit };