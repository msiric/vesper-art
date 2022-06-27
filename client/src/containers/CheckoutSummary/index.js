import { yupResolver } from "@hookform/resolvers/yup";
import {
  ArrowUpwardRounded as SubmitIcon,
  RemoveRounded as RemoveIcon,
} from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { featureFlags, payment } from "../../../../common/constants";
import { discountValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index";
import CheckoutCard from "../../components/CheckoutCard/index";
import CheckoutItem from "../../components/CheckoutItem/index";
import ListItems from "../../components/ListItems/index";
import Card from "../../domain/Card";
import CardActions from "../../domain/CardActions";
import CardContent from "../../domain/CardContent";
import Divider from "../../domain/Divider";
import Grid from "../../domain/Grid";
import Typography from "../../domain/Typography";
import DiscountForm from "../../forms/DiscountForm/index";
import { isFormDisabled } from "../../utils/helpers";
import checkoutSummaryStyles from "./styles";

const CheckoutSummary = ({
  version,
  watchables,
  discount,
  handleDiscountChange,
  loading,
  submitting,
  paying,
  step,
}) => {
  const { licenseType } = watchables;

  const [state, setState] = useState({
    summary: {
      license: null,
      amount: 0,
    },
    values: {
      price: 0,
      fee: 0,
      discount: 0,
      total: 0,
    },
  });

  const summaryItems = [
    <CheckoutItem
      label={version.title}
      description={
        state.summary.license
          ? `${state.summary.license} license`
          : "No license selected"
      }
      amount="Price"
      animate
      price={state.values.price}
      loading={loading}
    />,
    <Divider />,
    <CheckoutItem
      label="Platform fee"
      description="Fixed fee"
      amount="Amount"
      prefix="+"
      animate
      price={state.values.fee}
      loading={loading}
    />,
    <Divider />,
    discount ? (
      <>
        <CheckoutItem
          label="Discount"
          description={`${discount.name} (${discount.discount * 100}%)`}
          amount="Amount"
          prefix="-"
          animate
          price={state.values.discount}
          loading={loading}
        />
        <Divider />
      </>
    ) : null,
    <CheckoutItem
      label="Order"
      description={
        state.summary.license
          ? `${state.summary.license} license`
          : "No license selected"
      }
      amount="Total"
      animate
      price={state.values.total}
      loading={loading}
    />,
  ];

  const setDefaultValues = () => ({
    discountCode: "",
  });

  const {
    handleSubmit,
    formState,
    errors,
    control,
    setValue,
    trigger,
    getValues,
    watch,
  } = useForm({
    defaultValues: setDefaultValues(),
    resolver: yupResolver(discountValidation),
  });

  const watchedValues = watch();

  const isDisabled = isFormDisabled(getValues(), setDefaultValues(), formState);

  const onSubmit = async (values) => await handleDiscountChange({ values });

  const history = useHistory();

  const classes = checkoutSummaryStyles();

  const recalculateValues = () => {
    const selectedLicense = licenseType;
    const selectedAmount = version[licenseType];
    const calculatedPrice = selectedLicense ? selectedAmount : 0;
    const calculatedFee = selectedAmount
      ? (
          selectedAmount * payment.buyerFee.multiplier +
          payment.buyerFee.addend
        ).toFixed(2)
      : 0;
    const calculatedDiscount = discount
      ? (selectedAmount * discount.discount).toFixed(2)
      : 0;
    const calculatedTotal = selectedAmount
      ? discount
        ? (
            selectedAmount -
            selectedAmount * discount.discount +
            (selectedAmount * payment.buyerFee.multiplier +
              payment.buyerFee.addend)
          ).toFixed(2)
        : (
            selectedAmount +
            (selectedAmount * payment.buyerFee.multiplier +
              payment.buyerFee.addend)
          ).toFixed(2)
      : 0;

    setState((prevState) => ({
      ...prevState,
      summary: {
        license: selectedLicense,
        amount: selectedAmount,
      },
      values: {
        price: calculatedPrice,
        fee: calculatedFee,
        discount: calculatedDiscount,
        total: calculatedTotal,
      },
    }));
  };

  useEffect(() => {
    if (version.id) {
      recalculateValues();
    }
  }, [version, licenseType, discount]);

  return (
    <Card className={classes.container}>
      <CardContent className={classes.content}>
        <Typography variant="h6" gutterBottom loading={loading}>
          Order summary
        </Typography>
        <Grid item xs={12} className={classes.card}>
          <CheckoutCard version={version} loading={loading} />
        </Grid>
        <ListItems items={summaryItems} custom />
      </CardContent>
      {/* // FEATURE FLAG - discount */}
      {step.current === 2 && featureFlags.discount && (
        <CardActions className={classes.actions}>
          {/* $TODO Update intent when discount changes */}
          {/* Fix AsyncButton loading/submitting */}
          {discount ? (
            <AsyncButton
              type="button"
              fullWidth
              loading={loading}
              submitting={submitting}
              disabled={paying}
              onClick={() =>
                handleDiscountChange({ values: { discountCode: null } })
              }
              startIcon={<RemoveIcon />}
            >
              Remove discount
            </AsyncButton>
          ) : (
            <FormProvider control={control}>
              <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                <DiscountForm errors={errors} loading={state.loading} />
                <AsyncButton
                  type="submit"
                  fullWidth
                  loading={loading}
                  submitting={submitting}
                  disabled={isDisabled || paying}
                  startIcon={<SubmitIcon />}
                >
                  Apply
                </AsyncButton>
              </form>
            </FormProvider>
          )}
        </CardActions>
      )}
    </Card>
  );
};

export default CheckoutSummary;
