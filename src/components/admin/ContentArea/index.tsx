
import Box from "@mui/material/Box"
import styles from "./style.module.scss"
import Products from "../Products"
import Users from "../Users"
import Settings from "../Settings"
import Dashboard from "../Dashboard"
import Filters from "../Filters"

export enum PageTypes {
    Dashboard = 'Dashboard',
    Products = 'Products',
    Filters = 'Filters',
    Users = 'Users',
    Settings = 'Settings'
}
interface ContentAreaProps {
    pageType: PageTypes
}



const renderComponents: Record<PageTypes, React.ComponentType> = {
    [PageTypes.Dashboard]: Dashboard,
    [PageTypes.Products]: Products,
    [PageTypes.Filters]: Filters,
    [PageTypes.Users]: Users,
    [PageTypes.Settings]: Settings,
}

const ContentArea = ({ pageType }: ContentAreaProps) => {
    const PageComponent = renderComponents[pageType]

    return <Box className={
        styles.contentArea
    }>

        <PageComponent />
    </Box>
}


export { ContentArea }