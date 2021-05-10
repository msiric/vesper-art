import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Step,
  StepConnector,
  StepLabel,
  Stepper,
  withStyles,
} from "@material-ui/core";
import {
  CardMembershipRounded as LicenseIcon,
  CheckRounded as CheckIcon,
  ContactMailRounded as BillingIcon,
  PaymentRounded as PaymentIcon,
} from "@material-ui/icons";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import clsx from "clsx";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useHistory, useLocation, useParams } from "react-router-dom";
import {
  billingValidation,
  emptyValidation,
  licenseValidation,
} from "../../../../common/validation";
import CheckoutStatus from "../../components/CheckoutStatus";
import SkeletonWrapper from "../../components/SkeletonWrapper/index.js";
import CheckoutSummary from "../../containers/CheckoutSummary/index.js";
import { useUserStore } from "../../contexts/global/user.js";
import { useOrderCheckout } from "../../contexts/local/orderCheckout";
import BillingForm from "../../forms/BillingForm/index.js";
import LicenseForm from "../../forms/LicenseForm/index.js";
import PaymentForm from "../../forms/PaymentForm/index.js";
import globalStyles from "../../styles/global.js";
import checkoutProcessorStyles from "./styles.js";

const checkoutValidation = [
  licenseValidation,
  billingValidation,
  emptyValidation,
];

const STEPS = [
  "License information",
  "Billing information",
  "Payment information",
];

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
  const classes = iconsStyle();

  const icons = {
    1: <LicenseIcon />,
    2: <BillingIcon />,
    3: <PaymentIcon />,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(icon)]}
    </div>
  );
};

const iconsStyle = makeStyles((theme) => ({
  root: {
    backgroundColor: "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    background: theme.palette.primary.main,
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  },
  completed: {
    background: theme.palette.primary.main,
  },
}));

const CheckoutProcessor = () => {
  const { id: versionId } = useParams();

  const userIntents = useUserStore((state) => state.intents);
  const version = useOrderCheckout((state) => state.version.data);
  const intent = useOrderCheckout((state) => state.intent.data);
  const discount = useOrderCheckout((state) => state.discount.data);
  const license = useOrderCheckout((state) => state.license);
  const secret = useOrderCheckout((state) => state.secret);
  const step = useOrderCheckout((state) => state.step);
  const paymentSuccess = useOrderCheckout((state) => state.payment.success);
  const paymentMessage = useOrderCheckout((state) => state.payment.message);
  const versionLoading = useOrderCheckout((state) => state.version.loading);
  const intentLoading = useOrderCheckout((state) => state.intent.loading);
  const discountLoading = useOrderCheckout((state) => state.discount.loading);
  const changeDiscount = useOrderCheckout((state) => state.changeDiscount);
  const changeStep = useOrderCheckout((state) => state.changeStep);
  const fetchCheckout = useOrderCheckout((state) => state.fetchCheckout);
  const saveIntent = useOrderCheckout((state) => state.saveIntent);
  const submitPayment = useOrderCheckout((state) => state.submitPayment);

  const stripe = useStripe();
  const elements = useElements();
  const history = useHistory();
  const location = useLocation();

  const licenseValue =
    location.state && location.state.license ? location.state.license : license;

  const globalClasses = globalStyles();
  const classes = checkoutProcessorStyles();

  const {
    handleSubmit,
    formState,
    errors,
    control,
    setValue,
    trigger,
    getValues,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      licenseType: licenseValue,
      licenseAssignee: "",
      licenseCompany: "",
      billingName: "",
      billingSurname: "",
      billingEmail: "",
      billingAddress: "",
      billingZip: "",
      billingCity: "",
      billingCountry: "",
    },
    resolver: yupResolver(checkoutValidation[step.current]),
    shouldUnregister: false,
  });

  const licenseType = watch("licenseType");

  const licenseOptions =
    license === "personal"
      ? [
          {
            label: "Personal blogging, websites and social media",
          },
          {
            label:
              "Home printing, art and craft projects, personal portfolios and gifts",
          },
          { label: "Students and charities" },
          {
            label:
              "The personal use license is not suitable for commercial activities",
          },
        ]
      : [
          {
            label:
              "Print and digital advertising, broadcasts, product packaging, presentations, websites and blogs",
          },
          {
            label:
              "Home printing, art and craft projects, personal portfolios and gifts",
          },
          { label: "Students and charities" },
          {
            label:
              "The personal use license is not suitable for commercial activities",
          },
        ];

  const onSubmit = (values) => {
    const isFirstStep = step.current === 0;
    const isLastStep = step.current === step.length - 1;
    console.log("first", isFirstStep, "last", isLastStep);
    if (isLastStep) {
      submitPayment({ values, stripe, elements, history, changeStep });
    } else if (isFirstStep) {
      saveIntent({ values, userIntents, changeStep });
    } else {
      changeStep({ value: 1 });
    }
    // reset(getValues());
  };

  const renderForm = (step) => {
    switch (step) {
      case 0:
        return (
          <LicenseForm
            version={version}
            errors={errors}
            loading={intentLoading}
          />
        );
      case 1:
        return (
          <BillingForm
            setValue={setValue}
            getValues={getValues}
            errors={errors}
            loading={intentLoading}
          />
        );
      case 2:
        return (
          <PaymentForm
            secret={secret}
            version={version}
            loading={intentLoading}
          />
        );
      case 3:
        return (
          <CheckoutStatus
            success={paymentSuccess}
            message={paymentMessage}
            version={version}
          />
        );

      default:
        return <div>Not Found</div>;
    }
  };

  useEffect(() => {
    fetchCheckout({ license: licenseValue, versionId });
  }, []);

  return (
    <Grid container spacing={2} style={{ margin: 0 }}>
      {versionLoading || (version.id && stripe) ? (
        <>
          <Grid item xs={12} md={8}>
            <FormProvider control={control}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className={classes.checkoutProcessorForm}
              >
                <Card elevation={5} className={classes.checkoutProcessorCard}>
                  <CardContent className={classes.checkoutProcessorContent}>
                    {intentLoading || stripe ? (
                      <Box className={classes.checkoutProcessorWrapper}>
                        {step.current !== 3 && (
                          <SkeletonWrapper
                            variant="text"
                            loading={intentLoading}
                            width="100%"
                          >
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
                          </SkeletonWrapper>
                        )}
                        <Box className={classes.checkoutProcessorMultiform}>
                          {renderForm(step.current)}
                          {step.current === 0 && (
                            <List
                              component="nav"
                              aria-label="Features"
                              style={{ width: "100%" }}
                              disablePadding
                            >
                              {licenseOptions.map((item) => (
                                <ListItem>
                                  <SkeletonWrapper
                                    variant="text"
                                    loading={intentLoading}
                                    style={{ marginRight: 10 }}
                                  >
                                    <ListItemIcon>
                                      <CheckIcon />
                                    </ListItemIcon>
                                  </SkeletonWrapper>
                                  <SkeletonWrapper
                                    variant="text"
                                    loading={intentLoading}
                                  >
                                    <ListItemText primary={item.label} />
                                  </SkeletonWrapper>
                                </ListItem>
                              ))}
                            </List>
                          )}
                        </Box>
                      </Box>
                    ) : null}
                  </CardContent>
                  {step.current !== 3 && (
                    <CardActions
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <SkeletonWrapper loading={intentLoading}>
                        <Button
                          variant="outlined"
                          disabled={step.current === 0}
                          onClick={() => changeStep({ value: -1 })}
                        >
                          Back
                        </Button>
                      </SkeletonWrapper>
                      <SkeletonWrapper loading={intentLoading}>
                        <Button
                          variant="outlined"
                          color="primary"
                          type="submit"
                          disabled={formState.isSubmitting}
                        >
                          {intentLoading ? (
                            <CircularProgress color="secondary" size={24} />
                          ) : (
                            "Next"
                          )}
                        </Button>
                      </SkeletonWrapper>
                    </CardActions>
                  )}
                </Card>
              </form>
            </FormProvider>
          </Grid>
          <Grid item xs={12} md={4}>
            <CheckoutSummary
              version={version}
              license={licenseType}
              discount={discount}
              handleDiscountChange={changeDiscount}
              loading={discountLoading}
              step={step}
            />
            <br />
          </Grid>
        </>
      ) : (
        // $TODO push to home and display error notification
        history.push("/")
      )}
    </Grid>
  );
};

export default CheckoutProcessor;
