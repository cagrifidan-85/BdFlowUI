import { Box, Collapse } from "@mui/material";
import React, { useState } from "react";
import Steppers from "./stepper";
import styles from "./style.module.scss";
import ChooseMaterial from "./chooseMaterial";
import ChooseEnvironment from "./chooseEnvironment";
import ChooseProduct from "./chooseProduct";
import { EnvironmentType, MaterialType, ProductFiltersModel, ProductType } from "@constants/index";

interface CalculateProductProps {
  products:ProductType[]
  filters:ProductFiltersModel
  onSelectMaterial: (value: MaterialType) => void;
  onSelectEnvironment: (value: EnvironmentType) => void;
  onSelectProduct: (value: string) => void;
  isSelectionActive: boolean
  onSelectionActive: (value: boolean) => void
  material?:MaterialType
  environment?:EnvironmentType
}


const CalculateProduct: React.FC<CalculateProductProps> = ({
  products,
  filters,
  onSelectMaterial,
  onSelectEnvironment,
  onSelectProduct,
  isSelectionActive,
  onSelectionActive,
  material,
  environment

}) => {

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
      <Collapse className={styles.calculateProduct__collapse} in={isSelectionActive}  >
        <Steppers currentStep={currentStep}  onStepChanged={(active) => setCurrentStep(active)} />
        <Collapse in={currentStep === 0} >
          <ChooseMaterial data={filters?.materials} onItemSelected={(value) => onSelectMaterial(value)} onNext={handleNext} />
        </Collapse>
        <Collapse in={currentStep === 1}>
          <ChooseEnvironment data={filters?.environments} onItemSelected={(value) => onSelectEnvironment(value)} onNext={handleNext} onBack={handleBack} />
        </Collapse>
        <Collapse in={currentStep === 2}>
          <ChooseProduct onItemSelected={(value: string) => onSelectProduct(value)} onBack={handleBack} products={products} material={material} environment={environment} />
        </Collapse>
      </Collapse>
    </Box>
  )
}

export default CalculateProduct
