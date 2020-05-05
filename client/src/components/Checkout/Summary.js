import React, { useRef, useState, useEffect } from 'react';
import { useStateValue } from '../Store/Stripe';
import { StateProvider } from '../Store/Stripe';
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

const Summary = ({ match, location }) => {
  const [{ main, formValues }, dispatch] = useStateValue();

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

  const handleRemoveDiscount = async () => {
    await ax.delete(`/api/discount/${main.discount._id}`);
    dispatch({
      type: 'editMainValue',
      key: 'discount',
      value: null,
    });
  };

  useEffect(() => {
    if (main.artwork._id) {
      const personalLicensesLength = getLicenseLength(
        'personal',
        formValues.licenses
      );
      const commercialLicensesLength = getLicenseLength(
        'commercial',
        formValues.licenses
      );
      const personalLicensesAmount =
        personalLicensesLength * main.artwork.current.price;
      const commercialLicensesAmount =
        commercialLicensesLength *
        (main.artwork.current.price + main.artwork.current.commercial);
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
  }, [formValues.licenses]);

  return (
    <Card className={classes.summary}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Order summary
        </Typography>
        <List disablePadding>
          <ListItem className={classes.listItem} key={main.artwork.current._id}>
            <ListItemText
              primary={<Typography>{main.artwork.current.title}</Typography>}
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
                        ? `${state.summary.commercial.length} commercial licenses`
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
          {main.discount ? (
            <>
              <ListItem className={classes.listItem}>
                <ListItemText
                  primary={<Typography>Discount</Typography>}
                  secondary={
                    <div>
                      <Typography>{`${main.discount.name} (${
                        main.discount.discount * 100
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
                            main.discount.discount
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
                  {main.discount ? (
                    state.summary.personal.amount +
                    state.summary.commercial.amount ? (
                      <NumberFormat
                        value={
                          state.summary.personal.amount +
                          state.summary.commercial.amount -
                          (state.summary.personal.amount +
                            state.summary.commercial.amount) *
                            main.discount.discount
                        }
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
                      value={
                        state.summary.personal.amount +
                        state.summary.commercial.amount
                      }
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
        {main.discount ? (
          <Button
            type="button"
            color="error"
            onClick={handleRemoveDiscount}
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
              dispatch({
                type: 'editMainValue',
                key: 'discount',
                value: data.payload,
              });
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
