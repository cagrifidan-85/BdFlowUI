import { Box, Typography, IconButton } from "@mui/material";
import React, { useState} from "react";
import { useTranslation } from "react-i18next";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styles from "./style.module.scss";
import classnames from 'classnames/bind'
import { FilterBaseModel } from "@constants/index";


interface ChooseEnvironmentProps {
    data?:FilterBaseModel[]
    onItemSelected: (value: string) => void;
    onNext?: () => void;
    onBack?: () => void;
}

const cx = classnames.bind(styles)



const ChooseEnvironment: React.FC<ChooseEnvironmentProps> = ({data, onItemSelected, onNext, onBack }) => {
    const { t } = useTranslation();
    const lang = localStorage.getItem("currentLang");
    const [selectedEnvironment,setSelectedEnvironment]= useState<string>()

  
const getEnvironmentImage = (code: string) => {
  try {
    return require(`../../../../../../src/logos/environments/${code}.png`);
  } catch (error) {
    return ''; // Return empty string if image not found
  }
}
    const handleItemSelect =(item:FilterBaseModel)=>{

        setSelectedEnvironment(item.code)
    
        onItemSelected(item.code)
      }
    return (
        <Box className={styles.chooseEnvironment}>
            <Box className={styles.chooseEnvironment__container}>
                {data?.map((item) => (
                    <Box
                        key={item.code}
                        className={cx('chooseEnvironment__environments', {
                            'chooseEnvironment__environments--selected': selectedEnvironment===item.code,
                          })}
                      
                        onClick={() => handleItemSelect(item)}
                    >
                        <img
                            key={item.code}
                            src={getEnvironmentImage(item?.code.toString())}
                            loading="lazy"
                            width={100}
                            height={120}
                            title={t(item[`${lang === 'en' ? 'en' : 'tr'}`])}
                        />
                        <Typography>{t(item[`${lang === 'en' ? 'en' : 'tr'}`])}</Typography>
                    </Box>
                ))}
            </Box>
            {(
                <Box className={styles.chooseEnvironment__navigation}>
                    {onBack && (
                        <IconButton 
                            onClick={onBack}
                            className={styles.chooseEnvironment__navigationBtn}
                            size="large"
                        >
                            <ArrowBackIcon fontSize="large" />
                        </IconButton>
                    )}
                    {onNext && (
                        <IconButton 
                            onClick={onNext}
                            className={styles.chooseEnvironment__navigationBtn}
                            size="large"
                            disabled={!selectedEnvironment}
                        >
                            <ArrowForwardIcon fontSize="large" color={selectedEnvironment ? 'inherit' : 'disabled'} />
                        </IconButton>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default ChooseEnvironment;
