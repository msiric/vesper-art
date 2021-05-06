import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  List,
  Typography,
} from "@material-ui/core";
import { AddCircleRounded as UploadIcon } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import AsyncButton from "../../components/AsyncButton/index.js";
import CheckoutCard from "../../components/CheckoutCard/index.js";
import CheckoutItem from "../../components/CheckoutItem/index.js";
import SkeletonWrapper from "../../components/SkeletonWrapper/index.js";
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
  step,
}) => {
  const [state, setState] = useState({
    summary: {
      license: null,
      amount: 0,
    },
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
    defaultValues: {
      discountCode: "",
    },
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (values) => await handleDiscountChange(values);

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
        <SkeletonWrapper variant="text" loading={loading}>
          <Typography variant="h6" gutterBottom>
            Order summary
          </Typography>
        </SkeletonWrapper>
        <Grid
          item
          xs={12}
          className={classes.artwork}
          style={{ flexBasis: "auto" }}
        >
          <CheckoutCard version={version} loading={loading} />
        </Grid>
        <List disablePadding>
          <CheckoutItem
            label={version.title}
            description={
              state.summary.license
                ? `${license} license`
                : "No license selected"
            }
            amount="Price"
            price={state.summary.license ? state.summary.amount : 0}
          />
          <Divider />
          {discount ? (
            <>
              <CheckoutItem
                label="Discount"
                description={`${discount.name} (${discount.discount * 100}%)`}
                amount="Amount"
                price={(state.summary.amount * discount.discount).toFixed(2)}
              />
              <Divider />
            </>
          ) : null}
          <CheckoutItem
            label="Platform fee"
            description="Fixed fee"
            amount="Amount"
            price={
              state.summary.amount
                ? (state.summary.amount * 0.05 + 2.35).toFixed(2)
                : 0
            }
          />
          <Divider />
          <CheckoutItem
            label="Order"
            description={
              state.summary.license
                ? `${state.summary.license} license`
                : "No license selected"
            }
            amount="Total"
            price={
              state.summary.amount
                ? discount
                  ? state.summary.amount -
                    state.summary.amount * discount.discount +
                    (state.summary.amount * 0.05 + 2.35).toFixed(2)
                  : (
                      state.summary.amount +
                      (state.summary.amount * 0.05 + 2.35)
                    ).toFixed(2)
                : 0
            }
          />
        </List>
      </CardContent>
      {step.current !== 3 && (
        <CardActions className={classes.actions}>
          {/* $TODO Update intent when discount changes */}
          {discount ? (
            <Button
              type="button"
              color="error"
              onClick={() => handleDiscountChange(null)}
              fullWidth
            >
              Remove discount
            </Button>
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
                  loading={formState.isSubmitting}
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
