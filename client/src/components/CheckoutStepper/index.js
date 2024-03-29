import { withStyles } from "@material-ui/core";
import {
  CardMembershipRounded as LicenseIcon,
  ContactMailRounded as BillingIcon,
  PaymentRounded as PaymentIcon,
} from "@material-ui/icons";
import clsx from "clsx";
import React from "react";
import Box from "../../domain/Box";
import Step from "../../domain/Step";
import StepConnector from "../../domain/StepConnector";
import StepLabel from "../../domain/StepLabel";
import Stepper from "../../domain/Stepper";
import checkoutStepperStyles from "./styles";

const STEPS = [
  "License information",
  "Billing information",
  "Payment information",
];

const ICONS = {
  1: <LicenseIcon />,
  2: <BillingIcon />,
  3: <PaymentIcon />,
};

const Connector = withStyles((theme) => ({
  alternativeLabel: {
    top: 22,
  },
  active: {
    "& $line": {
      background: theme.palette.primary.main,
    },
  },
  completed: {
    "& $line": {
      background: theme.palette.primary.main,
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
  },
}))(StepConnector);

const StepperIcons = ({ active, completed, icon }) => {
  const classes = checkoutStepperStyles();

  return (
    <Box
      className={clsx(classes.icon, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {ICONS[String(icon)]}
    </Box>
  );
};

const CheckoutStepper = ({ step }) => {
  const classes = checkoutStepperStyles();

  return (
    <Box className={classes.wrapper}>
      {step.current !== STEPS.length && (
        <Stepper
          alternativeLabel
          connector={<Connector />}
          activeStep={step.current}
        >
          {STEPS.map((e) => (
            <Step key={e}>
              <StepLabel StepIconComponent={StepperIcons} />
            </Step>
          ))}
        </Stepper>
      )}
    </Box>
  );
};

export default CheckoutStepper;
