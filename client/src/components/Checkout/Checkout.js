import React, { useContext, useRef, useState, useEffect } from 'react';
import { Context } from '../Store/Store';
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
import CheckoutStyles from './Checkout.style';

const validationSchema = Yup.object().shape({
  discountCode: Yup.string().trim().required('Discount cannot be empty'),
});

const Checkout = ({ match, location }) => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    loading: true,
    artwork: {},
    licenses: [],
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
    discount: null,
  });

  const history = useHistory();

  const classes = CheckoutStyles();

  const fetchArtwork = async () => {
    try {
      const { data } = await ax.get(`/api/checkout/${match.params.id}`);
      setState({
        ...state,
        loading: false,
        artwork: data.artwork,
        licenses: [location.state.payload],
        discount: data.discount,
      });
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  const getLicenseLength = (condition, array) => {
    return array.filter((item) => item.licenseType === condition).length;
  };

  const handleRemoveDiscount = async () => {
    await ax.delete(`/api/discount/${state.discount._id}`);
    setState((prevState) => ({
      ...prevState,
      discount: null,
    }));
  };

  useEffect(() => {
    fetchArtwork();
  }, []);

  useEffect(() => {
    if (state.artwork._id) {
      const personalLicensesLength = getLicenseLength(
        'personal',
        state.licenses
      );
      const commercialLicensesLength = getLicenseLength(
        'commercial',
        state.licenses
      );
      const personalLicensesAmount =
        personalLicensesLength * state.artwork.current.price;
      const commercialLicensesAmount =
        commercialLicensesLength *
        (state.artwork.current.price + state.artwork.current.commercial);
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
  }, [state.licenses]);

  return (
    <StateProvider>
      <Container fixed className={classes.fixed}>
        <Grid container className={classes.container} spacing={2}>
          {state.loading ? (
            <Grid item xs={12} className={classes.loader}>
              <CircularProgress />
            </Grid>
          ) : state.artwork._id ? (
            <>
              <Grid item xs={12} md={8} className={classes.artwork}>
                <Main />
              </Grid>
              <Grid item xs={12} md={4} className={classes.actions}>
                <Card className={classes.summary}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Order summary
                    </Typography>
                    <List disablePadding>
                      <ListItem
                        className={classes.listItem}
                        key={state.artwork.current._id}
                      >
                        <ListItemText
                          primary={
                            <Typography>
                              {state.artwork.current.title}
                            </Typography>
                          }
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
                            </div>
                          }
                        />
                        <ListItemText
                          primary={
                            <Typography className={classes.rightList}>
                              Price
                            </Typography>
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
                                    'Free'
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
                                    'Free'
                                  )}
                                </div>
                              ) : null}
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
                            </div>
                          }
                        />
                        <ListItemText
                          primary={
                            <Typography className={classes.rightList}>
                              Subtotal
                            </Typography>
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
                                    'Free'
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
                                    'Free'
                                  )}
                                </div>
                              ) : null}
                            </div>
                          }
                        />
                      </ListItem>
                      <Divider />
                      {state.discount ? (
                        <>
                          <ListItem className={classes.listItem}>
                            <ListItemText
                              primary={<Typography>Discount</Typography>}
                              secondary={
                                <div>
                                  <Typography>{`${state.discount.name} (${
                                    state.discount.discount * 100
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
                                        state.discount.discount
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
                            ) : null
                          }
                        />
                        <ListItemText
                          primary={
                            <Typography className={classes.rightList}>
                              Total
                            </Typography>
                          }
                          secondary={
                            <Typography className={classes.rightList}>
                              {state.discount ? (
                                state.summary.personal.amount +
                                state.summary.commercial.amount ? (
                                  <NumberFormat
                                    value={
                                      state.summary.personal.amount +
                                      state.summary.commercial.amount -
                                      (state.summary.personal.amount +
                                        state.summary.commercial.amount) *
                                        state.discount.discount
                                    }
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    prefix={'$'}
                                  />
                                ) : (
                                  'Free'
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
                                'Free'
                              )}
                            </Typography>
                          }
                        />
                      </ListItem>
                    </List>
                    {state.discount ? (
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
                          const { data } = await ax.post(
                            '/api/discount',
                            values
                          );
                          setState((prevState) => ({
                            ...prevState,
                            discount: data.payload,
                          }));
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
                <br />
              </Grid>
            </>
          ) : (
            'a'
          )}
        </Grid>
      </Container>
    </StateProvider>
  );
};

export default Checkout;
