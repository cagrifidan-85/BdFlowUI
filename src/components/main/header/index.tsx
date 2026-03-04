import React, { useState, useEffect } from "react";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import styles from "../header/style.module.scss";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface HeaderProps {
  currentLang: string | null;
  onChangeLang: (val: string | null) => void;
}
export const Header: React.FC<HeaderProps> = ({
  onChangeLang,
  currentLang,
}) => {
  const { t } = useTranslation();

  return (
    <Box className={styles.header}>
      <Box
        style={{
          display: "flex",
          justifyContent: "flex-start",
          gap: 5,
          alignItems: "center",
        }}
      >
        <AttachEmailIcon />
        <Divider
          orientation="vertical"
          flexItem
          variant="fullWidth"
          style={{ borderColor: "white" }}
        />
       {t('email')}
      </Box>
      <Box className={styles.header__controls}> <Link style={{ color: "white" }} to="/admin">{t('admin.panel.header')}</Link>
      <Box onClick={() => onChangeLang(currentLang === "tr" ? "en" : "tr")}>
        {t("header.lang")}
      </Box>
      </Box>
    </Box>
  );
};
export default Header;
