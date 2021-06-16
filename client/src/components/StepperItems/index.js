import React from "react";
import Step from "../../domain/Step";
import StepLabel from "../../domain/StepLabel";
import Stepper from "../../domain/Stepper";
import SkeletonWrapper from "../SkeletonWrapper/index.js";
import stepperItemsStyles from "./styles.js";

const StepperItems = ({
  connector,
  activeStep,
  steps,
  icons,
  loading,
  ...props
}) => {
  const classes = stepperItemsStyles();

  return (
    <Stepper
      alternativeLabel
      connector={connector}
      activeStep={activeStep}
      {...props}
    >
      {steps.map((e) => (
        <SkeletonWrapper variant="circle" loading={loading}>
          <Step key={e}>
            <StepLabel StepIconComponent={icons} />
          </Step>
        </SkeletonWrapper>
      ))}
    </Stepper>
  );
};

export default StepperItems;
