import { Box, IconButton, Link, Typography } from "@mui/material"
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import logo from "@images/navigationLogo.jpg";
import styles from "./style.module.scss"
import { useTranslation } from "react-i18next";
import { useGetSiteSettingsQuery } from "@apis/siteSettings";

const Footer = () => {
  const { t } = useTranslation();
  const { data: siteSettings } = useGetSiteSettingsQuery(undefined, {
    refetchOnFocus: false,
    refetchOnReconnect: false,
    pollingInterval: 300000,
  });
  const currentYear = new Date().getFullYear();
  const contact = siteSettings?.contact ?? {
    email: t('footer.contact.email'),
    phone: t('footer.contact.phone'),
    address: t('footer.contact.address'),
  };
  return (
    <Box component="footer" className={styles.footer}>
      <Box className={styles.footer__row}>
        <Box className={styles.footer__rowColLeft}>
            <Box className={styles.footer__rowColLeftTitleBox}>
              <img src={logo} alt="BdFlow Logo"  className={styles.footer__rowColLeftLogo} />
            </Box>
            <Typography  className={styles.footer__rowColLeftBrand}>
              {t('footer.brand.description')}
            </Typography>
        </Box>

        <Box className={styles.footer__rowColMiddle}>
          <Box className={styles.footer__rowColMiddleMenu}>
            <Link href="#" underline="hover" className={styles.footer__rowColMiddleMenuLink}>{t('footer.menu.home')}</Link>
            <Link href="#" underline="hover" className={styles.footer__rowColMiddleMenuLink}>{t('footer.menu.products')}</Link>
            <Link href="#" underline="hover" className={styles.footer__rowColMiddleMenuLink}>{t('footer.menu.about')}</Link>
            <Link href="#" underline="hover" className={styles.footer__rowColMiddleMenuLink}>{t('navigation.menu.communication')}</Link>
          </Box>
          <Box className={styles.footer__rowColMiddleCopyright}>
            {t('footer.copyright', { year: currentYear })}
          </Box>
        </Box>

        <Box className={styles.footer__rowColSocial}>
          <Typography variant="subtitle1" fontWeight={600} className={styles.footer__rowColSocialTitle}>{t('footer.social.title')}</Typography>
          <Box className={styles.footer__rowColSocialIcons}>
            <IconButton color="primary" size="small" href="#" className={styles.footer__rowColSocialIcon}><FacebookIcon /></IconButton>
            <IconButton color="primary" size="small" href="#" className={styles.footer__rowColSocialIcon}><TwitterIcon /></IconButton>
            <IconButton color="primary" size="small" href="#" className={styles.footer__rowColSocialIcon}><InstagramIcon /></IconButton>
            <IconButton color="primary" size="small" href="#" className={styles.footer__rowColSocialIcon}><LinkedInIcon /></IconButton>
          </Box>
        </Box>

        <Box className={styles.footer__rowColRight}>
          <Typography variant="subtitle1" fontWeight={600} className={styles.footer__rowColRightTitle}>{t('footer.contact.title')}</Typography>
          <Box className={styles.footer__rowColRightContent}>
            <Typography variant="body2">{contact.email}</Typography>
            <Typography variant="body2">{contact.phone}</Typography>
            <Typography variant="body2">{contact.address}</Typography>
          </Box>
        </Box>

      </Box>



    </Box>
  )
}

export default Footer

