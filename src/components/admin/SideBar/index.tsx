import { Box } from "@mui/material"
import styles from "./style.module.scss"
import { useTranslation } from 'react-i18next';
import { Link } from "react-router";
import { PageTypes } from "../ContentArea";
import logo from '../../../images/navigationLogo.jpg'

interface SideBarProps {
    onNavigate: (path: PageTypes) => void
}

const SideBar = ({ onNavigate }: SideBarProps) => {
    const { t } = useTranslation()




    return (

        <Box className={styles.sideBar}>
            <Box>
                <h2>{t('admin.panel.header')}</h2>
                <ul>
                    <Box mb={2} mt={2} fontWeight="bold" className={styles.sideBar__menu}>
                        <li className={styles.sideBar__menuItem} onClick={() => onNavigate(PageTypes.Dashboard)}><Link to='' >{t('admin.panel.dashboard')}</Link></li>
                        <li className={styles.sideBar__menuItem} onClick={() => onNavigate(PageTypes.Products)}><Link to=''>{t('admin.panel.products')}</Link></li>
                        <li className={styles.sideBar__menuItem} onClick={() => onNavigate(PageTypes.Users)}><Link to=''>{t('admin.panel.users')}</Link></li>
                        <li className={styles.sideBar__menuItem} onClick={() => onNavigate(PageTypes.Settings)}><Link to=''>{t('admin.panel.settings')}</Link></li>
                    </Box>
                    <li className={styles.sideBar__menuItem}><Link to="/">{t('admin.panel.mainPage')}</Link></li>


                </ul>
            </Box>
            <Box className={styles.sideBar__logoBox}>
                <img src={logo} loading="lazy"  />
            </Box>
        </Box>
    )
}
export default SideBar
