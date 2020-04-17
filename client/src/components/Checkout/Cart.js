import React, { useContext, useState, useEffect } from 'react';
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
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
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
        ) : (
          <>
            <Grid item sm={12} md={8} className={classes.artwork}>
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
                        {item.artwork.current.price
                          ? `$${item.artwork.current.price}`
                          : 'Free'}
                      </Typography>
                    </CardContent>
                    <div className={classes.controls}></div>
                  </div>
                </Card>
              ))}
              <br />
            </Grid>
            <Grid item sm={12} md={4} className={classes.actions}>
              <Card className={classes.details}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order summary
                  </Typography>
                  <List disablePadding>
                    {state.cart.map((item) => (
                      <ListItem
                        className={classes.listItem}
                        key={item.artwork.current._id}
                      >
                        <ListItemText
                          primary={item.artwork.current.title}
                          secondary={item.artwork.current.description}
                        />
                        <Typography variant="body2">
                          {item.artwork.current.price}
                        </Typography>
                      </ListItem>
                    ))}
                    <ListItem className={classes.listItem}>
                      <ListItemText primary="Total" />
                      <Typography variant="subtitle1" className={classes.total}>
                        {/* {state.cart.reduce(
                          (a, b) =>
                            a.artwork.current.price + b.artwork.current.price,
                          0
                        )} */}
                        TOTAL
                      </Typography>
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
