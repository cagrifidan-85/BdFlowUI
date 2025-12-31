import { Box, Tab, Tabs, Typography } from "@mui/material";
import React, { useState } from "react";
import logo from "../../../../logos/navigationLogo.jpg";
import styles from "./style.module.scss";
import {
  Home,
  ListOutlined,
  SvgIconComponent,
  PermPhoneMsg,
  Info,
} from "@mui/icons-material";

import { useTranslation } from "react-i18next";

interface NavigationMenuProps {
  icon: SvgIconComponent;
  text: string;
}

export const NavigationBar = () => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState(0);

  const MenuItems: NavigationMenuProps[] = [
    {
      icon: Home,
      text: t("navigation.menu.home"),
    },
    {
      icon: ListOutlined,
      text: t("navigation.menu.products"),
    },
    {
      icon: PermPhoneMsg,
      text: t("navigation.menu.communication"),
    },
    {
      icon: Info,
      text: t("navigation.menu.about"),
    },
  ];

  return (
    <Box className={styles.navigationBar}>
      <Box className={styles.navigationBar__logo}>
        <img src={logo} loading="lazy" />
      </Box>
      <Box className={styles.navigationBar__menu}>
        <Tabs value={selectedTab} centered   textColor='inherit' indicatorColor='primary' >
          {MenuItems.map((item, index) => (
            <Tab
              icon={<item.icon />}
              key={index}
              onClick={() => setSelectedTab(index)}
              label={item.text}
            />
          ))}
        </Tabs>
      </Box>
    </Box>
  );
};

export default NavigationBar;
