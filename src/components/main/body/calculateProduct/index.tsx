import { Box, Typography, Collapse } from "@mui/material";
import React, { useState } from "react";
import Steppers from "./stepper";
import styles from "./style.module.scss";
import { useTranslation } from "react-i18next";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ChooseMaterial from "./chooseMaterial";
import ChooseEnvironment from "./chooseEnvironment";
import ChooseProduct from "./chooseProduct";

interface CalculateProductProps {
  onSelectMaterial: (value: string) => void;
  onSelectEnvironment: (value: string) => void;
  onSelectProduct: (value: string) => void;
  isSelectionActive: boolean
  onSelectionActive: (value: boolean) => void
}


const CalculateProduct: React.FC<CalculateProductProps> = ({
  onSelectMaterial,
  onSelectEnvironment,
  onSelectProduct,
  isSelectionActive,
  onSelectionActive

}) => {
  const { t } = useTranslation();

  const [currentStep, setCurrentStep] = useState<number>(0);

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (

    <Box className={styles.calculateProduct} >
      <Collapse className={styles.calculateProduct__collapse} in={isSelectionActive} >
        <Steppers currentStep={currentStep} onStepChanged={(active) => setCurrentStep(active)} />
        <Collapse in={currentStep === 0} >
          <ChooseMaterial onItemSelected={(value) => onSelectMaterial(value)} onNext={handleNext} />
        </Collapse>
        <Collapse in={currentStep === 1}>
          <ChooseEnvironment onItemSelected={(value) => onSelectEnvironment(value)} onNext={handleNext} onBack={handleBack} />
        </Collapse>
        <Collapse in={currentStep === 2}>
          <ChooseProduct onItemSelected={(value: string) => onSelectProduct(value)} onBack={handleBack} />
        </Collapse>
      </Collapse>
    </Box>
  )
}

export default CalculateProduct
