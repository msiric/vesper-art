import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { AddCircleRounded as UploadIcon } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import NumberFormat from "react-number-format";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import AsyncButton from "../../components/AsyncButton/index.js";
import CheckoutCard from "../../components/CheckoutCard/index.js";
import SkeletonWrapper from "../../components/SkeletonWrapper/index.js";
import DiscountForm from "../../forms/DiscountForm/index.js";
import checkoutSummaryStyles from "./styles.js";

const validationSchema = Yup.object().shape({
  discountCode: Yup.string().trim().required("Discount cannot be empty"),
});

const CheckoutSummary = ({
  match,
  location,
  version,
  license,
  discount,
  handleDiscountChange,
  loading,
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
    <Card
      className={classes.summary}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          paddingBottom: 8,
        }}
      >
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
          <ListItem
            className={classes.listItem}
            key={version.id}
            disableGutters
          >
            <ListItemText
              primary={
                <SkeletonWrapper variant="text" loading={loading}>
                  <Typography>{version.title || "Artwork title"}</Typography>
                </SkeletonWrapper>
              }
              secondary={
                <SkeletonWrapper variant="text" loading={loading}>
                  <Typography className={classes.listContent}>
                    {state.summary.license
                      ? `${license} license`
                      : "No license selected"}
                  </Typography>
                </SkeletonWrapper>
              }
            />
            <ListItemText
              primary={
                <SkeletonWrapper variant="text" loading={loading}>
                  <Typography className={classes.rightList}>Price</Typography>
                </SkeletonWrapper>
              }
              secondary={
                <div className={classes.rightList}>
                  <SkeletonWrapper variant="text" loading={loading}>
                    <NumberFormat
                      value={state.summary.license ? state.summary.amount : 0}
                      displayType={"text"}
                      thousandSeparator={true}
                      decimalScale={2}
                      prefix={"$"}
                    />
                  </SkeletonWrapper>
                </div>
              }
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            />
          </ListItem>

          <Divider />
          {discount ? (
            <>
              <ListItem className={classes.listItem} disableGutters>
                <ListItemText
                  primary={<Typography>Discount</Typography>}
                  secondary={
                    <div>
                      <Typography>{`${discount.name} (${
                        discount.discount * 100
                      }%)`}</Typography>
                    </div>
                  }
                />
                <ListItemText
                  primary={
                    <Typography className={classes.rightList}>
                      Amount
                    </Typography>
                  }
                  secondary={
                    <div>
                      <Typography className={classes.rightList}>
                        <NumberFormat
                          value={(
                            state.summary.amount * discount.discount
                          ).toFixed(2)}
                          displayType={"text"}
                          thousandSeparator={true}
                          decimalScale={2}
                          prefix={"- $"}
                        />
                      </Typography>
                    </div>
                  }
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }}
                />
              </ListItem>
              <Divider />
            </>
          ) : null}
          <ListItem className={classes.listItem} disableGutters>
            <ListItemText
              primary={
                <SkeletonWrapper variant="text" loading={loading}>
                  <Typography>Platform fee</Typography>
                </SkeletonWrapper>
              }
              secondary={
                <SkeletonWrapper variant="text" loading={loading}>
                  <Typography>Fixed fee</Typography>
                </SkeletonWrapper>
              }
            />
            <ListItemText
              primary={
                <SkeletonWrapper variant="text" loading={loading}>
                  <Typography className={classes.rightList}>Amount</Typography>
                </SkeletonWrapper>
              }
              secondary={
                <SkeletonWrapper variant="text" loading={loading}>
                  <Typography className={classes.rightList}>
                    <NumberFormat
                      value={
                        state.summary.amount
                          ? (state.summary.amount * 0.05 + 2.35).toFixed(2)
                          : 0
                      }
                      displayType={"text"}
                      thousandSeparator={true}
                      decimalScale={2}
                      prefix={"$"}
                    />
                  </Typography>
                </SkeletonWrapper>
              }
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            />
          </ListItem>
          <Divider />
          <ListItem className={classes.listItem} disableGutters>
            <ListItemText
              primary={
                <SkeletonWrapper variant="text" loading={loading}>
                  <Typography>Order</Typography>
                </SkeletonWrapper>
              }
              secondary={
                <SkeletonWrapper variant="text" loading={loading}>
                  <Typography className={classes.listContent}>
                    {state.summary.license
                      ? `${state.summary.license} license`
                      : "No license selected"}
                  </Typography>
                </SkeletonWrapper>
              }
            />
            <ListItemText
              primary={
                <SkeletonWrapper variant="text" loading={loading}>
                  <Typography className={classes.rightList}>Total</Typography>
                </SkeletonWrapper>
              }
              secondary={
                <SkeletonWrapper variant="text" loading={loading}>
                  <Typography className={classes.rightList}>
                    {state.summary.amount ? (
                      discount ? (
                        <NumberFormat
                          value={(
                            state.summary.amount -
                            state.summary.amount * discount.discount +
                            (state.summary.amount * 0.05 + 2.35)
                          ).toFixed(2)}
                          displayType={"text"}
                          thousandSeparator={true}
                          decimalScale={2}
                          prefix={"$"}
                        />
                      ) : (
                        <NumberFormat
                          value={(
                            state.summary.amount +
                            (state.summary.amount * 0.05 + 2.35)
                          ).toFixed(2)}
                          displayType={"text"}
                          thousandSeparator={true}
                          decimalScale={2}
                          prefix={"$"}
                        />
                      )
                    ) : (
                      <NumberFormat
                        value={0}
                        displayType={"text"}
                        thousandSeparator={true}
                        decimalScale={2}
                        prefix={"$"}
                      />
                    )}
                  </Typography>
                </SkeletonWrapper>
              }
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            />
          </ListItem>
        </List>
      </CardContent>
      <CardActions className={classes.actions}>
        {/* Update intent when discount changes */}
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent>
                <DiscountForm errors={errors} loading={state.loading} />
              </CardContent>
              <CardActions
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <AsyncButton
                  type="submit"
                  fullWidth
                  variant="outlined"
                  color="primary"
                  padding
                  loading={formState.isSubmitting}
                  startIcon={<UploadIcon />}
                >
                  Apply
                </AsyncButton>
              </CardActions>
            </form>
          </FormProvider>
        )}
      </CardActions>
    </Card>
  );
};

export default CheckoutSummary;
