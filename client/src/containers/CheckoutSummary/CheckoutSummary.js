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
} from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import CheckoutCard from '../../components/CheckoutCard/CheckoutCard.js';

const validationSchema = Yup.object().shape({
  discountCode: Yup.string().trim().required('Discount cannot be empty'),
});

const CheckoutSummary = ({
  match,
  location,
  artwork,
  license,
  discount,
  handleDiscountChange,
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
    if (artwork._id) {
      setState((prevState) => ({
        ...prevState,
        summary: {
          license: license,
          amount: artwork.current[license],
        },
      }));
    }
  }, [license]);

  return (
    <Card className={classes.summary}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Order summary
        </Typography>
        <Grid item xs={12} className={classes.artwork}>
          <CheckoutCard artwork={artwork} />
        </Grid>
        <List disablePadding>
          <ListItem className={classes.listItem} key={artwork.current._id}>
            <ListItemText
              primary={<Typography>{artwork.current.title}</Typography>}
              secondary={
                <div>
                  {!state.summary.license ? (
                    <div>No licenses selected</div>
                  ) : (
                    <div>{`1 ${license} license`}</div>
                  )}
                </div>
              }
            />
            <ListItemText
              primary={
                <Typography className={classes.rightList}>Price</Typography>
              }
              secondary={
                <div className={classes.rightList}>
                  <div>
                    {state.summary.license ? (
                      <NumberFormat
                        value={state.summary.amount}
                        displayType={'text'}
                        thousandSeparator={true}
                        decimalScale={2}
                        prefix={'$'}
                      />
                    ) : (
                      '$0'
                    )}
                  </div>
                </div>
              }
            />
          </ListItem>

          <Divider />
          {discount ? (
            <>
              <ListItem className={classes.listItem}>
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
                          displayType={'text'}
                          thousandSeparator={true}
                          decimalScale={2}
                          prefix={'- $'}
                        />
                      </Typography>
                    </div>
                  }
                />
              </ListItem>
              <Divider />
            </>
          ) : null}
          <ListItem className={classes.listItem}>
            <ListItemText
              primary={<Typography>Platform fee</Typography>}
              secondary={
                <div>
                  <Typography>Fixed fee</Typography>
                </div>
              }
            />
            <ListItemText
              primary={
                <Typography className={classes.rightList}>Amount</Typography>
              }
              secondary={
                <div>
                  <Typography className={classes.rightList}>
                    <NumberFormat
                      value={
                        state.summary.amount
                          ? (state.summary.amount * 0.05 + 2.35).toFixed(2)
                          : 0
                      }
                      displayType={'text'}
                      thousandSeparator={true}
                      decimalScale={2}
                      prefix={'$'}
                    />
                  </Typography>
                </div>
              }
            />
          </ListItem>
          <Divider />
          <ListItem className={classes.listItem}>
            <ListItemText
              primary={<Typography>Order</Typography>}
              secondary={
                state.summary.license ? (
                  <Typography>
                    {`1 ${state.summary.license} license`}
                  </Typography>
                ) : (
                  'No licenses selected'
                )
              }
            />
            <ListItemText
              primary={
                <Typography className={classes.rightList}>Total</Typography>
              }
              secondary={
                <Typography className={classes.rightList}>
                  {state.summary.amount ? (
                    discount ? (
                      <NumberFormat
                        value={(
                          state.summary.amount -
                          state.summary.amount * discount.discount +
                          (state.summary.amount * 0.05 + 2.35)
                        ).toFixed(2)}
                        displayType={'text'}
                        thousandSeparator={true}
                        decimalScale={2}
                        prefix={'$'}
                      />
                    ) : (
                      <NumberFormat
                        value={(
                          state.summary.amount +
                          (state.summary.amount * 0.05 + 2.35)
                        ).toFixed(2)}
                        displayType={'text'}
                        thousandSeparator={true}
                        decimalScale={2}
                        prefix={'$'}
                      />
                    )
                  ) : (
                    <NumberFormat
                      value={0}
                      displayType={'text'}
                      thousandSeparator={true}
                      decimalScale={2}
                      prefix={'$'}
                    />
                  )}
                </Typography>
              }
            />
          </ListItem>
        </List>
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
              discountCode: '',
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
              <Form>
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
                <CardActions className={classes.actions}>
                  <Button
                    type="submit"
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                  >
                    Apply
                  </Button>
                </CardActions>
              </Form>
            )}
          </Formik>
        )}
      </CardContent>
    </Card>
  );
};

export default CheckoutSummary;
