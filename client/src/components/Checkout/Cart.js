import React, { useContext, useRef, useState, useEffect } from 'react';
import { Context } from '../Store/Store';
import SelectInput from '../../shared/SelectInput/SelectInput';
import { useFormik } from 'formik';
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
import CartStyles from './Cart.style';

const validationSchema = Yup.object().shape({
  licenseType: Yup.string()
    .matches(/(personal|commercial)/)
    .required('License type is required'),
  licenseeName: Yup.string()
    .trim()
    .required('License holder full name is required'),
  licenseeCompany: Yup.string()
    .notRequired()
    .when('commercial', {
      is: 'commercial',
      then: Yup.string().trim().required('License holder company is required'),
    }),
});

const Cart = () => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    loading: true,
    cart: [],
    discount: null,
    modal: {
      open: false,
    },
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

  const classes = CartStyles();

  const {
    isSubmitting,
    resetForm,
    handleSubmit,
    handleChange,
    handleBlur,
    touched,
    values,
    errors,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      licenseType: state.license,
      licenseeName: '',
      licenseeCompany: '',
    },
    validationSchema,
    async onSubmit(values) {
      try {
      } catch (err) {
        console.log(err);
      }
    },
  });

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

  const handleModalOpen = () => {
    setState((prevState) => ({
      ...prevState,
      modal: {
        ...prevState.modal,
        open: true,
      },
    }));
  };

  const handleModalClose = () => {
    resetForm();
    setState((prevState) => ({
      ...prevState,
      modal: {
        ...prevState.modal,
        open: false,
        body: ``,
      },
    }));
  };

  const getLength = (condition, array) => {
    return array.filter((item) => item.type === condition).length;
  };

  useEffect(() => {
    fetchCart();
  }, []);

  console.log(state.loading);

  return (
    <Container fixed className={classes.fixed}>
      <Grid container className={classes.container} spacing={2}>
        {state.loading ? (
          <Grid item xs={12} className={classes.loader}>
            <CircularProgress />
          </Grid>
        ) : (
          <>
            <Grid item xs={12} md={8} className={classes.artwork}>
              {state.cart.map((item) => (
                <Card className={classes.root}>
                  <CardMedia
                    className={classes.cover}
                    image={item.artwork.current.cover}
                    title={item.artwork.current.title}
                  />
                  <div className={classes.details}>
                    <CardContent className={classes.content}>
                      <Typography component="h5" variant="h5">
                        {item.artwork.current.title}
                      </Typography>
                      <Typography variant="subtitle1" color="textSecondary">
                        {item.artwork.current.description}
                      </Typography>
                    </CardContent>
                    <div className={classes.controls}>
                      <CardContent className={classes.content}>
                        <Button
                          type="button"
                          className={classes.manageLicenses}
                        >
                          Manage licenses
                        </Button>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
              <br />
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
                </CardContent>
              </Card>
              <br />
            </Grid>
          </>
        )}
        <div>
          <Modal
            open={false}
            onClose={handleModalClose}
            aria-labelledby="License modal"
            className={classes.modal}
          >
            <form className={classes.form} onSubmit={handleSubmit}>
              <div className={classes.licenseContainer}>
                <Card className={classes.card}>
                  <Typography variant="h6" align="center">
                    Manage licenses
                  </Typography>
                  <CardContent>
                    <SelectInput
                      name="licenseType"
                      label="License type"
                      value={values.licenseType}
                      className={classes.license}
                      disabled
                      options={[
                        {
                          value: state.license,
                          text: state.license,
                        },
                      ]}
                    />
                    <TextField
                      name="licenseeName"
                      label="License holder full name"
                      type="text"
                      value={values.licenseeName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={
                        touched.licenseeName ? errors.licenseeName : ''
                      }
                      error={
                        touched.licenseeName && Boolean(errors.licenseeName)
                      }
                      margin="dense"
                      variant="outlined"
                      fullWidth
                    />
                    {state.license === 'commercial' && (
                      <TextField
                        name="licenseeCompany"
                        label="License holder company"
                        type="text"
                        value={values.licenseeCompany}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        helperText={
                          touched.licenseeCompany ? errors.licenseeCompany : ''
                        }
                        error={
                          touched.licenseeCompany &&
                          Boolean(errors.licenseeCompany)
                        }
                        margin="dense"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  </CardContent>
                  <CardActions className={classes.actions}>
                    <Button
                      type="submit"
                      color="primary"
                      disabled={isSubmitting}
                    >
                      Save
                    </Button>
                    <Button
                      type="button"
                      color="error"
                      onClick={handleModalClose}
                    >
                      Close
                    </Button>
                  </CardActions>
                </Card>
              </div>
            </form>
          </Modal>
        </div>
      </Grid>
    </Container>
  );
};

export default Cart;
