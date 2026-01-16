import { ContentArea, PageTypes } from "@components/admin/ContentArea"
import SideBar from "@components/admin/SideBar"
import { Box } from "@mui/material"
import { useState } from "react"
import styles from "./style.module.scss"
const AdminPage = () => {
    const [pageType, setPageType] = useState<PageTypes>(PageTypes.Dashboard)
    return (
        <Box className={styles.adminPage}>
            <SideBar onNavigate={setPageType} />
            <ContentArea pageType={pageType} />
        </Box>
    )
}
export default AdminPage