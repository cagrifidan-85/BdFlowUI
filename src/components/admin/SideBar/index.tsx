import { Box, Typography } from "@mui/material"
import styles from "./style.module.scss"
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { PageTypes } from "../ContentArea";
import logo from '../../../images/navigationLogo.jpg'

interface SideBarProps {
    onNavigate: (path: PageTypes) => void
}

const SideBar = ({ onNavigate }: SideBarProps) => {
    const { t } = useTranslation()

    const navigationItems = [
        { label: t('admin.panel.dashboard'), page: PageTypes.Dashboard },
        { label: t('admin.panel.products'), page: PageTypes.Products },
        { label: t('admin.panel.users'), page: PageTypes.Users },
        { label: t('admin.panel.settings'), page: PageTypes.Settings },
    ]

    return (
        <Box className={styles.sideBar}>
            <Box className={styles.sideBar__brand}>
                <Link
                    to="/"
                    className={styles.sideBar__logoLink}
                    aria-label={t('admin.panel.mainPage') ?? 'Go to main page'}
                >
                    <img className={styles.sideBar__logo} src={logo} alt="BdFlow admin" loading="lazy" />
                </Link>
                <Typography component="h2" className={styles.sideBar__title}>
                    {t('admin.panel.header')}
                </Typography>
            </Box>

            <Box component="nav" className={styles.sideBar__menu} aria-label={t('admin.panel.header') ?? 'Admin navigation'}>
                {navigationItems.map(({ label, page }) => (
                    <button
                        key={page}
                        type="button"
                        className={styles.sideBar__menuItem}
                        onClick={() => onNavigate(page)}
                    >
                        <span>{label}</span>
                    </button>
                ))}
            </Box>

            <Box className={styles.sideBar__footer}>
                
                <Link className={styles.sideBar__externalLink} to="/">
                    {t('admin.panel.mainPage')}
                </Link>
            </Box>
        </Box>
    )
}
export default SideBar
