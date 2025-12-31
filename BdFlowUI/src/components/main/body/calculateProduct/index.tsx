import { Box, Typography, Collapse } from "@mui/material";
import React, {  useState } from "react";
import Steppers from "./stepper";
import styles from "./style.module.scss";
import { useTranslation } from "react-i18next";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ChooseMaterial from "./chooseMaterial";
import ChooseEnvironment from "./chooseEnvironment";
interface CalculateProductProps {
  onSelectMaterial: (value: string) => void;
  onSelectEnvironment: (value: string) => void;
  isSelectionActive:boolean
  onSelectionActive:(value: boolean)=>void
}


const CalculateProduct: React.FC<CalculateProductProps> = ({
  onSelectMaterial,
  onSelectEnvironment,
  isSelectionActive,
  onSelectionActive

}) => {
  const { t } = useTranslation();
  
  const [currentStep, setCurrentStep] = useState<number>();

 
  return (

      <Box className={styles.calculateProduct} >
        <Box
          className={styles.calculateProduct__link}
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          onClick={() => onSelectionActive(!isSelectionActive)
          }>
          <FactCheckIcon />
          <Typography>{t("body.select.product")}</Typography>
         {isSelectionActive?<ArrowDropUpIcon/>: <ArrowDropDownIcon/> }
        </Box>
       
          <Collapse in={isSelectionActive} >
            <Steppers onStepChanged={(active) => setCurrentStep(active)} />
            <Collapse in={currentStep === 0} >
             
              <ChooseMaterial  onItemSelected={(value) => onSelectMaterial(value)} />
          
            </Collapse>
            <Collapse in={currentStep === 1}>
              <ChooseEnvironment onItemSelected={(value) => onSelectEnvironment(value)} ></ChooseEnvironment>
            </Collapse>
            <Collapse in={currentStep === 2}></Collapse>
          </Collapse>
      </Box>
  );
};

export default CalculateProduct;
