import { Box, Typography, IconButton } from "@mui/material";
import React,{useState} from "react";
import { useTranslation } from "react-i18next";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import styles from "./style.module.scss";
import classnames from 'classnames/bind'

interface ChooseMaterialProps {
  onItemSelected: (value: string) => void;
  onNext?: () => void;
}

const cx = classnames.bind(styles)

const ChooseMaterial: React.FC<ChooseMaterialProps> = ({ onItemSelected, onNext }) => {
  const { t } = useTranslation();
  const [itemSelected,setItemSelected]= useState<string>("")

  const materials = [
    { id: "level", text: t("level") },
    { id: "limit", text: t("limit") },
    { id: "pressure", text: t("pressure") },
    { id: "separatorLayer", text: t("separatorLayer") },
    { id: "intensity", text: t("intensity") },
    { id: "massFlow", text: t("massFlow") },
  ];


  const handleItemSelect =(id:string)=>{

    setItemSelected(id)

    onItemSelected(id)
  }
  return (
    <Box className={styles.chooseMaterial}>
      <Box className={styles.chooseMaterial__container}>
        {materials.map((item) => (
          <Box
            key={item.id}
            className={cx('chooseMaterial__materials', {
              'chooseMaterial__materials--selected': itemSelected===item.id,
            })}
            onClick={() =>handleItemSelect(item.id)}
          >
            <img
              key={item.id}
              src={require("../../../../../../src/logos/materials/" +
                item.id +
                ".png")}
              loading="lazy"
              width={100}
              height={120}
              title="materials"
            />
            <Typography>{item.text}</Typography>
          </Box>
        ))}
      </Box>
      {itemSelected && onNext && (
        <Box className={styles.chooseMaterial__navigation}>
          <IconButton 
            onClick={onNext}
            className={styles.chooseMaterial__navigationBtn}
            size="large"
          >
            <ArrowForwardIcon fontSize="large" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default ChooseMaterial;
