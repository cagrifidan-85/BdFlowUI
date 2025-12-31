import * as React from "react";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Brightness1 from "@mui/icons-material/Brightness5";
import Brightness2 from "@mui/icons-material/Brightness6";
import Brightness3 from "@mui/icons-material/Brightness7";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { StepIconProps } from "@mui/material/StepIcon";
import styles from "./style.module.scss";
import { useTranslation } from "react-i18next";
import { StepNames } from "../types";
import { StepButton } from "@mui/material";

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
}));

const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme }) => ({
  backgroundColor: "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        backgroundImage:
          "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
        boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
      },
    },
    {
      props: ({ ownerState }) => ownerState.completed,
      style: {
        backgroundImage:
          "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
      },
    },
  ],
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement<any> } = {
    1: <Brightness1 />,
    2: <Brightness2 />,
    3: <Brightness3 />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}
interface StepperProps {
  onStepChanged: (value: number) => void;
}

const Steppers: React.FC<StepperProps> = ({ onStepChanged }) => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = React.useState(0);

  React.useEffect(() => {
    onStepChanged(activeStep);
  }, [activeStep]);

  const steps = [
    {
      id: StepNames.materials,
      title: "body.stepper.choose.material",
    },
    {
      id: StepNames.environment,
      title: "body.stepper.choose.environment",
    },
    {
      id: StepNames.products,
      title: "body.stepper.choose.list",
    },
  ];
  const handleActiveStepChanged = (index: number) => {
    setActiveStep(index);
    onStepChanged(index);
  };
  return (
    <Stack className={styles.stepper}>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<ColorlibConnector />}
        nonLinear
      >
        {steps.map((item, index) => (
          <Step key={item.id}>
            <StepButton onClick={() => handleActiveStepChanged(index)}>
              <StepLabel StepIconComponent={ColorlibStepIcon}>
                {t(item.title)}
              </StepLabel>
            </StepButton>
          </Step>
        ))}
      </Stepper>
    </Stack>
  );
};

export default Steppers;
