import PaymentDisclaimer from "@components/PaymentDisclaimer";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  CheckRounded as CheckIcon,
  CreditCardRounded as PayIcon,
  ErrorOutline as InfoIcon,
  HttpsOutlined as SecureIcon,
  NavigateBeforeRounded as BackIcon,
  NavigateNextRounded as NextIcon,
} from "@material-ui/icons";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { isFormAltered, isLicenseValid } from "../../../../common/helpers";
import {
  billingValidation,
  emptyValidation,
  licenseValidation,
} from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton";
import CheckoutStatus from "../../components/CheckoutStatus";
import CheckoutStepper from "../../components/CheckoutStepper";
import LicenseAlert from "../../components/LicenseAlert";
import ListItems from "../../components/ListItems";
import SyncButton from "../../components/SyncButton";
import { useUserStore } from "../../contexts/global/user";
import { useOrderCheckout } from "../../contexts/local/orderCheckout";
import Box from "../../domain/Box";
import Card from "../../domain/Card";
import CardActions from "../../domain/CardActions";
import CardContent from "../../domain/CardContent";
import Grid from "../../domain/Grid";
import BillingForm from "../../forms/BillingForm/index";
import LicenseForm from "../../forms/LicenseForm/index";
import PaymentForm from "../../forms/PaymentForm/index";
import { useLicenseValidator } from "../../hooks/useLicenseValidator";
import CheckoutSummary from "../CheckoutSummary/index";
import checkoutProcessorStyles from "./styles";

const STEPS = [
  "License information",
  "Billing information",
  "Payment information",
];

const CheckoutProcessor = () => {
  const { id: versionId } = useParams();

  const userId = useUserStore((state) => state.id);
  const userName = useUserStore((state) => state.fullName);

  const version = useOrderCheckout((state) => state.version.data);
  const orders = useOrderCheckout((state) => state.orders.data);
  const discount = useOrderCheckout((state) => state.discount.data);
  const license = useOrderCheckout((state) => state.license);
  const secret = useOrderCheckout((state) => state.secret);
  const step = useOrderCheckout((state) => state.step);
  const paymentSuccess = useOrderCheckout((state) => state.payment.success);
  const paymentHeading = useOrderCheckout((state) => state.payment.heading);
  const paymentSummary = useOrderCheckout((state) => state.payment.summary);
  const paymentTitle = useOrderCheckout((state) => state.payment.title);
  const paymentMessage = useOrderCheckout((state) => state.payment.message);
  const versionLoading = useOrderCheckout((state) => state.version.loading);
  const ordersLoading = useOrderCheckout((state) => state.orders.loading);
  const intentLoading = useOrderCheckout((state) => state.intent.loading);
  const discountLoading = useOrderCheckout((state) => state.discount.loading);
  const changeDiscount = useOrderCheckout((state) => state.changeDiscount);
  const changeStep = useOrderCheckout((state) => state.changeStep);
  const fetchCheckout = useOrderCheckout((state) => state.fetchCheckout);
  const fetchOrders = useOrderCheckout((state) => state.fetchOrders);
  const saveIntent = useOrderCheckout((state) => state.saveIntent);
  const submitPayment = useOrderCheckout((state) => state.submitPayment);
  const reflectErrors = useOrderCheckout((state) => state.reflectErrors);

  const stripe = useStripe();
  const elements = useElements();
  const history = useHistory();
  const location = useLocation();

  const licenseValue =
    location.state && location.state.license ? location.state.license : license;

  const initialLoading = versionLoading || ordersLoading;

  const classes = checkoutProcessorStyles();

  const licenseResolver = useLicenseValidator(licenseValidation);

  const checkoutValidation = [
    emptyValidation,
    billingValidation,
    emptyValidation,
  ];

  const setDefaultValues = () => ({
    licenseUsage: "",
    licenseCompany: "",
    licenseType: licenseValue,
    billingName: "",
    billingSurname: "",
    billingEmail: "",
    billingAddress: "",
    billingZip: "",
    billingCity: "",
    billingCountry: "",
  });

  const {
    handleSubmit,
    formState,
    errors,
    control,
    setValue,
    getValues,
    watch,
  } = useForm({
    defaultValues: setDefaultValues(),
    resolver:
      step.current === 0
        ? licenseResolver
        : yupResolver(checkoutValidation[step.current]),
    shouldUnregister: false,
  });

  const watchedValues = watch();

  const licenseStatus = isLicenseValid({
    data: getValues(),
    orders,
  });

  const isDisabled =
    !isFormAltered(getValues(), setDefaultValues()) ||
    formState.isSubmitting ||
    !licenseStatus.valid;

  const isLastStep = step.current === step.length;

  const licenseOptions =
    initialLoading || watchedValues.licenseType === "personal"
      ? [
          {
            icon: <CheckIcon />,
            label:
              "Personal projects, websites, social media and other non-commercial activities",
          },
          {
            icon: <CheckIcon />,
            label: "Must not, directly or indirectly, result in financial gain",
          },
          {
            icon: <CheckIcon />,
            label: "No digital rights management restrictions ",
          },
          {
            icon: <CheckIcon />,
            label: "Verifiable at all times using the license signature",
          },
        ]
      : [
          {
            icon: <CheckIcon />,
            label:
              "Advertising, promotion, product integration and other commercial activities",
          },
          {
            icon: <CheckIcon />,
            label: "Can, directly or indirectly, result in financial gain",
          },
          {
            icon: <CheckIcon />,
            label: "No digital rights management restrictions ",
          },
          {
            icon: <CheckIcon />,
            label: "Verifiable at all times using the license signature",
          },
        ];

  const billingOptions = [
    {
      icon: <InfoIcon />,
      label: "The information you enter here is displayed on the invoice",
    },
    {
      icon: <InfoIcon />,
      label: "Provides another layer of protection and security",
    },
    {
      icon: <InfoIcon />,
      label:
        "You will not be charged until you complete the form on the next page",
    },
  ];

  const paymentOptions = [
    {
      icon: <SecureIcon />,
      label: "TLS Secure Payment protocol",
    },
    {
      icon: <SecureIcon />,
      label: "AES-256 card information encryption",
    },
    {
      icon: <SecureIcon />,
      label: "3D Secure verification",
    },
  ];

  const disclaimerOptions = [licenseOptions, billingOptions, paymentOptions];

  const onSubmit = async (values) => {
    const isFirstStep = step.current === 0;
    const isLastStep = step.current === step.length - 1;
    if (isLastStep) {
      await submitPayment({
        values,
        stripe,
        elements,
        reflectErrors,
        changeStep,
      });
    } else if (isFirstStep) {
      await saveIntent({ values, changeStep });
    } else {
      changeStep({ value: 1 });
    }
  };

  const renderForm = (step) => {
    switch (step) {
      case 0:
        return (
          <LicenseForm
            getValues={getValues}
            version={version}
            userName={userName}
            isFree={false}
            watchables={{
              licenseUsage: watchedValues.licenseUsage,
            }}
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
            heading={paymentHeading}
            summary={paymentSummary}
            title={paymentTitle}
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [versionId]);

  useEffect(() => {
    version.artwork.id &&
      fetchOrders({ userId, artworkId: version.artwork.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version.artwork.id, userId]);

  return (
    <Grid container spacing={2}>
      {initialLoading || version.id ? (
        <>
          <Grid item xs={12} md={8}>
            <FormProvider control={control}>
              <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                <Card elevation={5} className={classes.card}>
                  <CardContent className={classes.content}>
                    {!!orders.length && !isLastStep && (
                      <LicenseAlert licenseStatus={licenseStatus} />
                    )}
                    {stripe ? (
                      <Box className={classes.wrapper}>
                        {!isLastStep && <CheckoutStepper step={step} />}
                        <Box className={classes.multiform}>
                          {renderForm(step.current)}
                          {!isLastStep && (
                            <ListItems
                              items={disclaimerOptions[step.current]}
                              loading={initialLoading}
                              className={classes.list}
                            />
                          )}
                          {step.current === step.length - 1 && (
                            <PaymentDisclaimer />
                          )}
                        </Box>
                      </Box>
                    ) : null}
                  </CardContent>
                  {step.current !== STEPS.length && (
                    <CardActions className={classes.actions}>
                      <SyncButton
                        disabled={
                          step.current === 0 || intentLoading || discountLoading
                        }
                        onClick={() => changeStep({ value: -1 })}
                        loading={initialLoading}
                        startIcon={<BackIcon />}
                      >
                        Back
                      </SyncButton>
                      <AsyncButton
                        type="submit"
                        loading={initialLoading}
                        submitting={formState.isSubmitting}
                        disabled={isDisabled || discountLoading}
                        startIcon={
                          step.current === step.length - 1 ? (
                            <PayIcon />
                          ) : (
                            <NextIcon />
                          )
                        }
                      >
                        {step.current === step.length - 1 ? "Pay" : "Next"}
                      </AsyncButton>
                    </CardActions>
                  )}
                </Card>
              </form>
            </FormProvider>
          </Grid>
          <Grid item xs={12} md={4}>
            <CheckoutSummary
              version={version}
              watchables={{ licenseType: watchedValues.licenseType }}
              discount={discount}
              handleDiscountChange={changeDiscount}
              loading={initialLoading}
              submitting={discountLoading}
              paying={intentLoading}
              step={step}
            />
          </Grid>
        </>
      ) : (
        // $TODO Push to home and display error notification
        history.push("/")
      )}
    </Grid>
  );
};

export default CheckoutProcessor;
