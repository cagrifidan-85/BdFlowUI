import { Box, IconButton, Link, Typography } from "@mui/material"
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import logo from "@images/navigationLogo.jpg";
import styles from "./style.module.scss"

const Footer = () => {
  return (
    <Box component="footer" className={styles.footer}>
      <Box className={styles.footer__row}>
        <Box className={styles.footer__rowColLeft}>
            <Box className={styles.footer__rowColLeftTitleBox}>
              <img src={logo} alt="BdFlow Logo"  className={styles.footer__rowColLeftLogo} />
            </Box>
            <Typography  className={styles.footer__rowColLeftBrand}>
              Endüstriyel otomasyon ve sensör teknolojilerinde yenilikçi çözümler sunuyoruz. Güvenilirlik ve kaliteyle işinizi ileriye taşıyın.
            </Typography>
        </Box>

        <Box className={styles.footer__rowColMiddle}>
          <Box className={styles.footer__rowColMiddleMenu}>
            <Link href="#" underline="hover" className={styles.footer__rowColMiddleMenuLink}>Ana Sayfa</Link>
            <Link href="#" underline="hover" className={styles.footer__rowColMiddleMenuLink}>Ürünler</Link>
            <Link href="#" underline="hover" className={styles.footer__rowColMiddleMenuLink}>Hakkımızda</Link>
            <Link href="#" underline="hover" className={styles.footer__rowColMiddleMenuLink}>İletişim</Link>
          </Box>
          <Box className={styles.footer__rowColMiddleCopyright}>
            © {new Date().getFullYear()} BdFlow. Tüm hakları saklıdır.
          </Box>
        </Box>

        <Box className={styles.footer__rowColSocial}>
          <Typography variant="subtitle1" fontWeight={600} className={styles.footer__rowColSocialTitle}>Bizi Takip Edin</Typography>
          <Box className={styles.footer__rowColSocialIcons}>
            <IconButton color="primary" size="small" href="#" className={styles.footer__rowColSocialIcon}><FacebookIcon /></IconButton>
            <IconButton color="primary" size="small" href="#" className={styles.footer__rowColSocialIcon}><TwitterIcon /></IconButton>
            <IconButton color="primary" size="small" href="#" className={styles.footer__rowColSocialIcon}><InstagramIcon /></IconButton>
            <IconButton color="primary" size="small" href="#" className={styles.footer__rowColSocialIcon}><LinkedInIcon /></IconButton>
          </Box>
        </Box>

        <Box className={styles.footer__rowColRight}>
          <Typography variant="subtitle1" fontWeight={600} className={styles.footer__rowColRightTitle}>İletişim</Typography>
          <Box className={styles.footer__rowColRightContent}>
            <Typography variant="body2">info@bdflow.com</Typography>
            <Typography variant="body2">+90 212 000 00 00</Typography>
            <Typography variant="body2">İstanbul, Türkiye</Typography>
          </Box>
        </Box>

      </Box>



    </Box>
  )
}

export default Footer

