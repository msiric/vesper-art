import React from "react";
import Step from "../../domain/Step";
import StepLabel from "../../domain/StepLabel";
import Stepper from "../../domain/Stepper";
import SkeletonWrapper from "../SkeletonWrapper/index";

const StepperItems = ({
  connector,
  activeStep,
  steps,
  icons,
  loading,
  ...props
}) => {
  return (
    <Stepper
      alternativeLabel
      connector={connector}
      activeStep={activeStep}
      {...props}
    >
      {steps.map((step) => (
        <SkeletonWrapper key={step} variant="circle" loading={loading}>
          <Step>
            <StepLabel StepIconComponent={icons} />
          </Step>
        </SkeletonWrapper>
      ))}
    </Stepper>
  );
};

export default StepperItems;
