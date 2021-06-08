import { yupResolver } from "@hookform/resolvers/yup";
import { AddCircleRounded as UploadIcon } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { payment } from "../../../../common/constants";
import AsyncButton from "../../components/AsyncButton/index.js";
import CheckoutCard from "../../components/CheckoutCard/index.js";
import CheckoutItem from "../../components/CheckoutItem/index.js";
import ListItems from "../../components/ListItems/index.js";
import Card from "../../domain/Card";
import CardActions from "../../domain/CardActions";
import CardContent from "../../domain/CardContent";
import Divider from "../../domain/Divider";
import Grid from "../../domain/Grid";
import Typography from "../../domain/Typography";
import DiscountForm from "../../forms/DiscountForm/index.js";
import checkoutSummaryStyles from "./styles.js";

const validationSchema = Yup.object().shape({
  discountCode: Yup.string().trim().required("Discount cannot be empty"),
});

const CheckoutSummary = ({
  version,
  license,
  discount,
  handleDiscountChange,
  loading,
  submitting,
  paying,
  step,
}) => {
  const [state, setState] = useState({
    summary: {
      license: null,
      amount: 0,
    },
  });

  const calculatePrice = () =>
    state.summary.license ? state.summary.amount : 0;

  const calculateFee = () =>
    state.summary.amount
      ? (
          state.summary.amount * payment.buyerFee.multiplier +
          payment.buyerFee.added
        ).toFixed(2)
      : 0;

  const calculateDiscount = () =>
    discount ? (state.summary.amount * discount.discount).toFixed(2) : 0;

  const calculateTotal = () =>
    state.summary.amount
      ? discount
        ? (
            state.summary.amount -
            state.summary.amount * discount.discount +
            (state.summary.amount * payment.buyerFee.multiplier +
              payment.buyerFee.addend)
          ).toFixed(2)
        : (
            state.summary.amount +
            (state.summary.amount * payment.buyerFee.multiplier +
              payment.buyerFee.addend)
          ).toFixed(2)
      : 0;

  const summaryItems = [
    <CheckoutItem
      label={version.title}
      description={
        state.summary.license
          ? `${state.summary.license} license`
          : "No license selected"
      }
      amount="Price"
      animate={true}
      price={calculatePrice()}
      loading={loading}
    />,
    <Divider />,
    <CheckoutItem
      label="Platform fee"
      description="Fixed fee"
      amount="Amount"
      prefix="+"
      animate={true}
      price={calculateFee()}
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
          animate={true}
          price={calculateDiscount()}
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
      animate={true}
      price={calculateTotal()}
      loading={loading}
    />,
  ];

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
    defaultValues: {
      discountCode: "",
    },
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (values) => await handleDiscountChange({ values });

  const history = useHistory();

  const classes = checkoutSummaryStyles();

  useEffect(() => {
    if (version.id) {
      setState((prevState) => ({
        ...prevState,
        summary: {
          license: license,
          amount: version[license],
        },
      }));
    }
  }, [version, license]);

  return (
    <Card className={classes.checkoutSummaryRoot}>
      <CardContent className={classes.checkoutSummaryContent}>
        <Typography variant="h6" gutterBottom loading={loading}>
          Order summary
        </Typography>
        <Grid
          item
          xs={12}
          className={classes.artwork}
          style={{ flexBasis: "auto" }}
        >
          <CheckoutCard version={version} loading={loading} />
        </Grid>
        <ListItems items={summaryItems} custom={true}></ListItems>
      </CardContent>
      {step.current === 2 && (
        <CardActions className={classes.checkoutSummaryActions}>
          {/* $TODO Update intent when discount changes */}
          {/* Fix AsyncButton loading/submitting */}
          {discount ? (
            <AsyncButton
              type="button"
              fullWidth
              variant="outlined"
              color="error"
              loading={loading}
              submitting={submitting}
              disabled={paying}
              onClick={() =>
                handleDiscountChange({ values: { discountCode: null } })
              }
            >
              Remove discount
            </AsyncButton>
          ) : (
            <FormProvider control={control}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className={classes.checkoutSummaryForm}
              >
                <DiscountForm errors={errors} loading={state.loading} />
                <AsyncButton
                  type="submit"
                  fullWidth
                  variant="outlined"
                  color="primary"
                  submitting={formState.isSubmitting}
                  loading={loading}
                  submitting={submitting}
                  disabled={paying}
                  startIcon={<UploadIcon />}
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
