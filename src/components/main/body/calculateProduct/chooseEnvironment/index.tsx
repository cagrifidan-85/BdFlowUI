import { Box, Typography, IconButton } from "@mui/material";
import React, { useState} from "react";
import { useTranslation } from "react-i18next";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styles from "./style.module.scss";
import classnames from 'classnames/bind'
import { EnvironmentType } from "@constants/index";


interface ChooseEnvironmentProps {
    onItemSelected: (value: EnvironmentType) => void;
    onNext?: () => void;
    onBack?: () => void;
}

const cx = classnames.bind(styles)

const ChooseEnvironment: React.FC<ChooseEnvironmentProps> = ({ onItemSelected, onNext, onBack }) => {
    const { t } = useTranslation();
    const [selectedEnvironment,setSelectedEnvironment]= useState<EnvironmentType>()

  

    const handleItemSelect =(item:EnvironmentType)=>{

        setSelectedEnvironment(item)
    
        onItemSelected(item)
      }
    return (
        <Box className={styles.chooseEnvironment}>
            <Box className={styles.chooseEnvironment__container}>
                {Object.values(EnvironmentType).map((item) => (
                    <Box
                        key={item}
                        className={cx('chooseEnvironment__environments', {
                            'chooseEnvironment__environments--selected': selectedEnvironment===item,
                          })}
                      
                        onClick={() => handleItemSelect(item)}
                    >
                        <img
                            key={item}
                            src={require("../../../../../../src/logos/environments/" +
                                item.toString() +
                                ".png")}
                            loading="lazy"
                            width={100}
                            height={120}
                            title={t(item.toLocaleLowerCase().toString())}
                        />
                        <Typography>{t(item.toLocaleLowerCase())}</Typography>
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
