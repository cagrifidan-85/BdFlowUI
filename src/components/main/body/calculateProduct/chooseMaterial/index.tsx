import { Box, Typography, IconButton } from "@mui/material";
import React,{useState} from "react";
import { useTranslation } from "react-i18next";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import styles from "./style.module.scss";
import classnames from 'classnames/bind'
import { FiterBaseModel, MaterialType } from "@constants/index";

interface ChooseMaterialProps {
  data?:FiterBaseModel[]
  onItemSelected: (value: MaterialType) => void;
  onNext?: () => void;
}

const cx = classnames.bind(styles)

const ChooseMaterial: React.FC<ChooseMaterialProps> = ({ data,  onItemSelected, onNext }) => {
  const { t } = useTranslation();
  const [itemSelected,setItemSelected]= useState<MaterialType>()
  const lang = localStorage.getItem("currentLang");


const getMaterialImage = (code: string) => {
  try {
    return require(`../../../../../../src/logos/materials/${code}.png`);
  } catch (error) {
    return ''; // Return empty string if image not found
  }
};
  const handleItemSelect =(item:MaterialType)=>{

    setItemSelected(item)

    onItemSelected(item)
  }
  return (
    <Box className={styles.chooseMaterial}>
      <Box className={styles.chooseMaterial__container}>
        {data?.map((item) => (
          <Box
            key={item.code}
            className={cx('chooseMaterial__materials', {
              'chooseMaterial__materials--selected': itemSelected===item.code,
            })}
            onClick={() =>handleItemSelect(item.code as MaterialType)}
          >
            <img
              key={item.code}
              src={getMaterialImage(item?.code.toString())}
              loading="lazy"
              width={100}
              height={120}
              title={t(item[`${lang === 'en' ? 'en' : 'tr'}`])}
            />
            <Typography>{t(item[`${lang === 'en' ? 'en' : 'tr'}`])}</Typography>
          </Box>
        ))}
      </Box>
      {  onNext && (
        <Box className={styles.chooseMaterial__navigation}>
          <IconButton 
            onClick={onNext}
            className={styles.chooseMaterial__navigationBtn}
            size="large"
            disabled={!itemSelected}
          >
            <ArrowForwardIcon fontSize="large" color={itemSelected ? 'inherit' : 'disabled'} />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default ChooseMaterial;
