import { Box, Typography, IconButton } from "@mui/material";
import React,{useState} from "react";
import { useTranslation } from "react-i18next";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import styles from "./style.module.scss";
import classnames from 'classnames/bind'
import { MaterialType } from "@constants/index";

interface ChooseMaterialProps {
  onItemSelected: (value: MaterialType) => void;
  onNext?: () => void;
}

const cx = classnames.bind(styles)

const ChooseMaterial: React.FC<ChooseMaterialProps> = ({ onItemSelected, onNext }) => {
  const { t } = useTranslation();
  const [itemSelected,setItemSelected]= useState<MaterialType>()




  const handleItemSelect =(item:MaterialType)=>{

    setItemSelected(item)

    onItemSelected(item)
  }
  return (
    <Box className={styles.chooseMaterial}>
      <Box className={styles.chooseMaterial__container}>
        {Object.values(MaterialType).map((item) => (
          <Box
            key={item.toString()} 
            className={cx('chooseMaterial__materials', {
              'chooseMaterial__materials--selected': itemSelected===item,
            })}
            onClick={() =>handleItemSelect(item)}
          >
            <img
              key={item.toString()}
              src={require("../../../../../../src/logos/materials/" +
                item.toString() +
                ".png")}
              loading="lazy"
              width={100}
              height={120}
              title={t(item.toLocaleLowerCase())}
            />
            <Typography>{t(item.toLocaleLowerCase())}</Typography>
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
