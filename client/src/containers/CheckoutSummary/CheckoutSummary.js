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
  TextField,
  Typography,
} from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import NumberFormat from "react-number-format";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import CheckoutCard from "../../components/CheckoutCard/CheckoutCard.js";
import SkeletonWrapper from "../../components/SkeletonWrapper/SkeletonWrapper.js";

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

  const history = useHistory();

  const classes = {};

  useEffect(() => {
    if (version._id) {
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
        <List>
          <ListItem
            className={classes.listItem}
            key={version._id}
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
                  <Typography>
                    {state.summary.license
                      ? `1 ${license} license`
                      : "No licenses selected"}
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
                  <Typography>
                    {state.summary.license
                      ? `1 ${state.summary.license} license`
                      : "No licenses selected"}
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
          <Formik
            initialValues={{
              discountCode: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleDiscountChange}
          >
            {({
              isSubmitting,
              values,
              errors,
              touched,
              enableReinitialize,
            }) => (
              <Form style={{ width: "100%" }}>
                <SkeletonWrapper variant="text" loading={loading} width="100%">
                  <Field name="discountCode">
                    {({ field, form: { touched, errors }, meta }) => (
                      <TextField
                        {...field}
                        onBlur={() => null}
                        label="Discount"
                        type="text"
                        helperText={meta.touched && meta.error}
                        error={meta.touched && Boolean(meta.error)}
                        margin="dense"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  </Field>
                </SkeletonWrapper>
                <SkeletonWrapper loading={loading} width="100%">
                  <Button
                    type="submit"
                    variant="outlined"
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                  >
                    Apply
                  </Button>
                </SkeletonWrapper>
              </Form>
            )}
          </Formik>
        )}
      </CardActions>
    </Card>
  );
};

export default CheckoutSummary;
