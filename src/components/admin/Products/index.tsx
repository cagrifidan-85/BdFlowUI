import Box from "@mui/material/Box"
import styles from "./style.module.scss"
import { Button, Pagination, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, CircularProgress, Alert } from "@mui/material"

import { useTranslation } from "react-i18next"
import { FilterBaseModel, ProductType } from "@constants/index"
import CurrencyInput from "react-currency-input-field"
import EditNoteIcon from '@mui/icons-material/EditNote'
import PreviewOutlinedIcon from '@mui/icons-material/PreviewOutlined'
import { useEffect, useState } from "react"
import { ProductDetail } from "./Detail"
import { ProductEdit } from "./Edit"
import { useGetAllProductsQuery, useGetFiltersQuery } from "@apis/products"

import CreateProduct from "./Create"


const Products = () => {

    const { t } = useTranslation()
    const lang = localStorage.getItem("currentLang")
    const { data: apiProducts, isLoading, isError } = useGetAllProductsQuery()
    const { data: filters, isError: isFiltersError, isLoading: isFiltersLoading } = useGetFiltersQuery()
    const [products, setProducts] = useState<ProductType[]>([])


    useEffect(() => {
        if (apiProducts) {
            setProducts(apiProducts)
        }
    }, [apiProducts])

    const maxItemsPerPage = 9
    const maxTablePageSize = Math.ceil(products.length / maxItemsPerPage);
    const [page, setPage] = useState(1);
    const [editModalProps, setEditModalProps] = useState<{ open: boolean; product: ProductType | null }>({ open: false, product: null });
    const [detailModalProps, setDetailModalProps] = useState<{ open: boolean; product: ProductType | null }>({ open: false, product: null });
    const [createModalProps, setCreateModalProps] = useState<{ open: boolean }>({ open: false });

    const handleEditClick = (product: ProductType) => {

        setEditModalProps({ open: true, product });
    }

    const handleDetailClick = (product: ProductType) => {

        setDetailModalProps({ open: true, product });
    }



    if (isLoading || isFiltersLoading) {
        return <Box className={styles.products} display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
        </Box>
    }

    if (isError) {
        return <Box className={styles.products} p={3}>
            <Alert severity="warning">
                {t('admin.products.error.loading')}
            </Alert>
        </Box>
    }

    return (
        <Box className={styles.products}>

            <Box className={styles.products__header}>
                <h2>{t('admin.products.header')}</h2>
                <Button variant="contained" color="primary" onClick={() => setCreateModalProps({ open: true })}>{t('admin.products.addNew')}</Button>
            </Box>
            <Table className={styles.products__table}>
                <TableHead className={styles.products__tableHeaders}>
                    <TableRow>
                        <TableCell>{t('admin.products.productId')}</TableCell>
                        <TableCell>{t('admin.products.productName')}</TableCell>
                        <TableCell>{t('admin.products.category')}</TableCell>
                        <TableCell>{t('admin.products.price')}</TableCell>
                        <TableCell>{t('admin.products.stock')}</TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody className={styles.products__tableBody}>
                    {products.slice((page - 1) * maxItemsPerPage, page * maxItemsPerPage).map((product, index) => (
                        <TableRow key={index} className={styles.products__tableBodyRow}>
                            <TableCell>{product.productNo}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.category ? filters?.categories?.filter((category: FilterBaseModel) => category.code === product.category)[0]?.[lang as 'tr' | 'en'] ?? '' : ''}</TableCell>
                            <TableCell><CurrencyInput value={product.price.amount} disabled suffix={product.price.currency} /></TableCell>
                            <TableCell>{product.stock}</TableCell>
                            <TableCell className={styles.products__tableBodyRowActions}>
                                <EditNoteIcon fontSize="large" sx={{ ml: 0.5 }} onClick={() => { handleEditClick(product) }} />

                                <PreviewOutlinedIcon fontSize="large" sx={{ ml: 0.5 }} onClick={() => handleDetailClick(product)} /></TableCell>
                        </TableRow>
                    ))}


                </TableBody>


            </Table>
            <Box className={styles.products__footer}>
                <Pagination count={maxTablePageSize} size="large" color="primary" onChange={(event, value) => setPage(value)} />

            </Box>

            {detailModalProps.product && <ProductDetail filters={filters} product={detailModalProps?.product} open={detailModalProps.open && Boolean(detailModalProps.product)} onClose={() => setDetailModalProps({ open: false, product: null })} />}
            {editModalProps.product && <ProductEdit filters={filters} product={editModalProps.product} open={editModalProps.open && Boolean(editModalProps.product)} onClose={() => setEditModalProps({ open: false, product: null })} />}
            {<CreateProduct filters={filters} open={createModalProps.open} onClose={() => setCreateModalProps({ open: false })} />}
        </Box>
    )
}
export default Products