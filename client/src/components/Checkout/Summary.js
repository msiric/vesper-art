import React, { useRef, useState, useEffect } from 'react';
import SelectField from '../../shared/SelectInput/SelectInput';
import NumberFormat from 'react-number-format';
import Main from './Main';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import {
  Modal,
  Container,
  Grid,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import ax from '../../axios.config';
import SummaryStyles from './Summary.style';

const validationSchema = Yup.object().shape({
  discountCode: Yup.string().trim().required('Discount cannot be empty'),
});

const Summary = ({
  match,
  location,
  artwork,
  licenses,
  discount,
  handleDiscountEdit,
}) => {
  const [state, setState] = useState({
    summary: {
      personal: {
        length: 0,
        amount: 0,
      },
      commercial: {
        length: 0,
        amount: 0,
      },
    },
  });

  const history = useHistory();

  const classes = SummaryStyles();

  const getLicenseLength = (condition, array) => {
    return array.filter((item) => item.licenseType === condition).length;
  };

  useEffect(() => {
    if (artwork._id) {
      const personalLicensesLength = getLicenseLength('personal', licenses);
      const commercialLicensesLength = getLicenseLength('commercial', licenses);
      const personalLicensesAmount =
        personalLicensesLength * artwork.current.personal;
      const commercialLicensesAmount =
        commercialLicensesLength * artwork.current.commercial;
      setState((prevState) => ({
        ...prevState,
        summary: {
          personal: {
            length: personalLicensesLength,
            amount: personalLicensesAmount,
          },
          commercial: {
            length: commercialLicensesLength,
            amount: commercialLicensesAmount,
          },
        },
      }));
    }
  }, [licenses]);

  return (
    <Card className={classes.summary}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Order summary
        </Typography>
        <List disablePadding>
          <ListItem className={classes.listItem} key={artwork.current._id}>
            <ListItemText
              primary={<Typography>{artwork.current.title}</Typography>}
              secondary={
                <div>
                  {state.summary.personal.length ? (
                    <div>
                      {state.summary.personal.length === 1
                        ? `${state.summary.personal.length} personal license`
                        : `${state.summary.personal.length} personal licenses`}
                    </div>
                  ) : null}
                  {state.summary.commercial.length ? (
                    <div>
                      {state.summary.commercial.length === 1
                        ? `${state.summary.commercial.length} commercial license`
                        : `${state.summary.commercial.length} commercial licenses`}
                    </div>
                  ) : null}
                  {!state.summary.personal.length &&
                  !state.summary.commercial.length
                    ? 'No licenses found'
                    : null}
                </div>
              }
            />
            <ListItemText
              primary={
                <Typography className={classes.rightList}>Price</Typography>
              }
              secondary={
                <div className={classes.rightList}>
                  {state.summary.personal.length ? (
                    <div>
                      {state.summary.personal.amount ? (
                        <NumberFormat
                          value={state.summary.personal.amount}
                          displayType={'text'}
                          thousandSeparator={true}
                          prefix={'$'}
                        />
                      ) : (
                        '$0'
                      )}
                    </div>
                  ) : null}
                  {state.summary.commercial.length ? (
                    <div>
                      {state.summary.commercial.amount ? (
                        <NumberFormat
                          value={state.summary.commercial.amount}
                          displayType={'text'}
                          thousandSeparator={true}
                          prefix={'$'}
                        />
                      ) : (
                        '$0'
                      )}
                    </div>
                  ) : null}
                  {!state.summary.personal.length &&
                  !state.summary.commercial.length
                    ? '$0'
                    : null}
                </div>
              }
            />
          </ListItem>

          <Divider />
          <ListItem className={classes.listItem}>
            {console.log(state.summary)}
            <ListItemText
              primary={<Typography>Items</Typography>}
              secondary={
                <div>
                  {state.summary.personal.length ? (
                    <div>
                      {state.summary.personal.length === 1
                        ? `${state.summary.personal.length} personal license`
                        : `${state.summary.personal.length} personal licenses`}
                    </div>
                  ) : null}
                  {state.summary.commercial.length ? (
                    <div>
                      {state.summary.commercial.length === 1
                        ? `${state.summary.commercial.length} commercial license`
                        : `${state.summary.commercial.length} commercial licenses`}
                    </div>
                  ) : null}
                  {!state.summary.personal.length &&
                  !state.summary.commercial.length
                    ? 'No licenses found'
                    : null}
                </div>
              }
            />
            <ListItemText
              primary={
                <Typography className={classes.rightList}>Subtotal</Typography>
              }
              secondary={
                <div className={classes.rightList}>
                  {state.summary.personal.length ? (
                    <div>
                      {state.summary.personal.amount ? (
                        <NumberFormat
                          value={state.summary.personal.amount}
                          displayType={'text'}
                          thousandSeparator={true}
                          prefix={'$'}
                        />
                      ) : (
                        '$0'
                      )}
                    </div>
                  ) : null}
                  {state.summary.commercial.length ? (
                    <div>
                      {state.summary.commercial.amount ? (
                        <NumberFormat
                          value={state.summary.commercial.amount}
                          displayType={'text'}
                          thousandSeparator={true}
                          prefix={'$'}
                        />
                      ) : (
                        '$0'
                      )}
                    </div>
                  ) : null}
                  {!state.summary.personal.length &&
                  !state.summary.commercial.length
                    ? '$0'
                    : null}
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
                            (state.summary.personal.amount +
                              state.summary.commercial.amount) *
                            discount.discount
                          ).toFixed(2)}
                          displayType={'text'}
                          thousandSeparator={true}
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
                      value={(
                        (state.summary.personal.amount +
                          state.summary.commercial.amount) *
                          0.05 +
                        2.35
                      ).toFixed(2)}
                      displayType={'text'}
                      thousandSeparator={true}
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
                state.summary.personal.length +
                state.summary.commercial.length ? (
                  <Typography>
                    {state.summary.personal.length +
                      state.summary.commercial.length ===
                    1
                      ? `${
                          state.summary.personal.length +
                          state.summary.commercial.length
                        } license`
                      : `${
                          state.summary.personal.length +
                          state.summary.commercial.length
                        } licenses`}
                  </Typography>
                ) : (
                  'No licenses found'
                )
              }
            />
            <ListItemText
              primary={
                <Typography className={classes.rightList}>Total</Typography>
              }
              secondary={
                <Typography className={classes.rightList}>
                  {discount ? (
                    state.summary.personal.amount +
                    state.summary.commercial.amount ? (
                      <NumberFormat
                        value={(
                          state.summary.personal.amount +
                          state.summary.commercial.amount -
                          (state.summary.personal.amount +
                            state.summary.commercial.amount) *
                            discount.discount +
                          ((state.summary.personal.amount +
                            state.summary.commercial.amount) *
                            0.05 +
                            2.35)
                        ).toFixed(2)}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={'$'}
                      />
                    ) : (
                      '$0'
                    )
                  ) : state.summary.personal.amount +
                    state.summary.commercial.amount ? (
                    <NumberFormat
                      value={(
                        state.summary.personal.amount +
                        state.summary.commercial.amount +
                        ((state.summary.personal.amount +
                          state.summary.commercial.amount) *
                          0.05 +
                          2.35)
                      ).toFixed(2)}
                      displayType={'text'}
                      thousandSeparator={true}
                      prefix={'$'}
                    />
                  ) : (
                    '$0'
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
            onClick={() => handleDiscountEdit(null)}
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
            onSubmit={async (values) => {
              const { data } = await ax.post('/api/discount', values);
              handleDiscountEdit(data.payload);
            }}
          >
            {({ values, errors, touched, enableReinitialize }) => (
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
                  <Button type="submit" color="primary" fullWidth>
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

export default Summary;
