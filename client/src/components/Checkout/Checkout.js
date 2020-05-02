import React, { useContext, useRef, useState, useEffect } from 'react';
import { Context } from '../Store/Store';
import { StateProvider } from '../Store/Stripe';
import SelectField from '../../shared/SelectInput/SelectInput';
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

const Checkout = () => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    loading: true,
    cart: [],
    discount: null,
  });
  const licenses = useRef({
    id: {},
    personal: {
      length: 0,
      amount: 0,
    },
    commercial: {
      length: 0,
      amount: 0,
    },
  });
  const history = useHistory();

  const classes = CheckoutStyles();

  const fetchCart = async () => {
    try {
      const { data } = await ax.get(`/api/cart`);

      setState({
        ...state,
        loading: false,
        cart: data.cart,
        discount: data.discount,
      });
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  const resetRef = () => {
    licenses.current = {
      id: {},
      personal: {
        length: 0,
        amount: 0,
      },
      commercial: {
        length: 0,
        amount: 0,
      },
    };
  };

  const getLength = (condition, array) => {
    return array.filter((item) => item.type === condition).length;
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <StateProvider>
      <Container fixed className={classes.fixed}>
        <Grid container className={classes.container} spacing={2}>
          {state.loading ? (
            <Grid item xs={12} className={classes.loader}>
              <CircularProgress />
            </Grid>
          ) : state.cart.length ? (
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
                      {state.cart.map((item) => {
                        const personalLicenses = {
                          length: getLength('personal', item.licenses),
                        };
                        const commercialLicenses = {
                          length: getLength('commercial', item.licenses),
                          amount: item.artwork.current.commercial,
                        };
                        personalLicenses.total =
                          personalLicenses.length * item.artwork.current.price;
                        commercialLicenses.total =
                          commercialLicenses.length *
                          (commercialLicenses.amount +
                            item.artwork.current.price);
                        if (!licenses.current.id[item.artwork.current._id])
                          licenses.current = {
                            id: {
                              ...licenses.current.id,
                              [item.artwork.current._id]: true,
                            },
                            personal: {
                              length:
                                licenses.current.personal.length +
                                personalLicenses.length,
                              amount:
                                licenses.current.personal.amount +
                                personalLicenses.total,
                            },
                            commercial: {
                              length:
                                licenses.current.commercial.length +
                                commercialLicenses.length,
                              amount:
                                licenses.current.commercial.amount +
                                commercialLicenses.total,
                            },
                          };
                        return (
                          <ListItem
                            className={classes.listItem}
                            key={item.artwork.current._id}
                          >
                            <ListItemText
                              primary={
                                <Typography>
                                  {item.artwork.current.title}
                                </Typography>
                              }
                              secondary={
                                <div>
                                  {personalLicenses.length ? (
                                    <div>
                                      {personalLicenses.length === 1
                                        ? `${personalLicenses.length} personal license`
                                        : `${personalLicenses.length} personal licenses`}
                                    </div>
                                  ) : null}
                                  {commercialLicenses.length ? (
                                    <div>
                                      {commercialLicenses.length === 1
                                        ? `${commercialLicenses.length} commercial license`
                                        : `${commercialLicenses.length} commercial licenses`}
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
                                  {personalLicenses.length ? (
                                    <div>
                                      {personalLicenses.total
                                        ? `$${personalLicenses.total}`
                                        : 'Free'}
                                    </div>
                                  ) : null}
                                  {commercialLicenses.length ? (
                                    <div>
                                      {commercialLicenses.total
                                        ? `$${commercialLicenses.total}`
                                        : 'Free'}
                                    </div>
                                  ) : null}
                                </div>
                              }
                            />
                          </ListItem>
                        );
                      })}
                      <Divider />
                      <ListItem className={classes.listItem}>
                        {console.log(licenses.current)}
                        <ListItemText
                          primary={<Typography>Items</Typography>}
                          secondary={
                            <div>
                              {licenses.current.personal.length ? (
                                <div>
                                  {licenses.current.personal.length === 1
                                    ? `${licenses.current.personal.length} personal license`
                                    : `${licenses.current.personal.length} personal licenses`}
                                </div>
                              ) : null}
                              {licenses.current.commercial.length ? (
                                <div>
                                  {licenses.current.commercial.length === 1
                                    ? `${licenses.current.commercial.length} commercial license`
                                    : `${licenses.current.commercial.length} commercial licenses`}
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
                              {licenses.current.personal.length ? (
                                <div>
                                  {licenses.current.personal.amount
                                    ? `$${licenses.current.personal.amount}`
                                    : 'Free'}
                                </div>
                              ) : null}
                              {licenses.current.commercial.length ? (
                                <div>
                                  {licenses.current.commercial.amount
                                    ? `$${licenses.current.commercial.amount}`
                                    : 'Free'}
                                </div>
                              ) : null}
                            </div>
                          }
                        />
                      </ListItem>
                      <Divider />
                      <ListItem className={classes.listItem}>
                        <ListItemText
                          primary={<Typography>Order</Typography>}
                          secondary={
                            <div>
                              {licenses.current.personal.length +
                              licenses.current.commercial.length ? (
                                <Typography>
                                  {licenses.current.personal.length +
                                    licenses.current.commercial.length ===
                                  1
                                    ? `${
                                        licenses.current.personal.length +
                                        licenses.current.commercial.length
                                      } license`
                                    : `${
                                        licenses.current.personal.length +
                                        licenses.current.commercial.length
                                      } licenses`}
                                </Typography>
                              ) : null}
                            </div>
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
                              {licenses.current.personal.amount +
                              licenses.current.commercial.amount
                                ? `$${
                                    licenses.current.personal.amount +
                                    licenses.current.commercial.amount
                                  }
                            `
                                : 'Free'}
                            </Typography>
                          }
                        />
                      </ListItem>
                    </List>
                    <Formik
                      initialValues={{
                        discountCode: '',
                      }}
                      validationSchema={validationSchema}
                      onSubmit={async (values) => {
                        const { data } = await ax.post('/api/discount', values);
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
                  </CardContent>
                </Card>
                <br />
              </Grid>
            </>
          ) : (
            state.stripe
          )}
        </Grid>
      </Container>
    </StateProvider>
  );
};

export default Checkout;
