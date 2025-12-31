import { Box, Typography } from "@mui/material";
import React, { useState} from "react";
import { useTranslation } from "react-i18next";
import styles from "./style.module.scss";
import classnames from 'classnames/bind'


interface ChooseEnvironmentProps {
    onItemSelected: (value: string) => void;
}

const cx = classnames.bind(styles)

const ChooseEnvironment: React.FC<ChooseEnvironmentProps> = ({ onItemSelected }) => {
    const { t } = useTranslation();
    const [selectedEnvironment,setSelectedEnvironment]= useState<string>()

    const materials = [
        { id: "gas", text: t("gas") },
        { id: "liquid", text: t("liquid") }
    ];

    const handleItemSelect =(id:string)=>{

        setSelectedEnvironment(id)
    
        onItemSelected(id)
      }
    return (
        <Box className={styles.chooseEnvironment}>
            {materials.map((item) => (
                <Box
                    key={item.id}
                    className={cx('chooseEnvironment__environments', {
                        'chooseEnvironment__environments--selected': selectedEnvironment===item.id,
                      })}
                  
                    onClick={() => handleItemSelect(item.id)}
                >
                    <img
                        key={item.id}
                        src={require("../../../../../../src/logos/environments/" +
                            item.id +
                            ".png")}
                        loading="lazy"
                        width={100}
                        height={120}
                        title="environments"
                    />
                    <Typography>{item.text}</Typography>
                </Box>
            ))}
        </Box>
    );
};

export default ChooseEnvironment;
