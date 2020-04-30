import React, { useContext, useRef, useState, useEffect } from 'react';
import { Context } from '../Store/Store';
import SelectField from '../../shared/SelectInput/SelectInput';
import StripeCardSection from './StripeCardSection';
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
import ax from '../../axios.config';
import CheckoutStyles from './Checkout.style';

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
    <Container fixed className={classes.fixed}>
      <Grid container className={classes.container} spacing={2}>
        {state.loading ? (
          <Grid item xs={12} className={classes.loader}>
            <CircularProgress />
          </Grid>
        ) : state.cart.length ? (
          <>
            <Grid item xs={12} md={8} className={classes.artwork}>
              <StripeCardSection />
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
                  <Button type="button" color="primary" fullWidth>
                    Continue
                  </Button>
                  <p>You won't be charged yet</p>
                </CardContent>
              </Card>
              <br />
            </Grid>
          </>
        ) : (
          <Grid item xs={12}>
            <p>Cart empty</p>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Checkout;
