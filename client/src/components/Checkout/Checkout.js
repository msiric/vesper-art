import React, { useContext, useRef, useState, useEffect } from 'react';
import { Context } from '../Store/Store';
import { StateProvider } from '../Store/Stripe';
import SelectField from '../../shared/SelectInput/SelectInput';
import NumberFormat from 'react-number-format';
import Main from './Main';
import Summary from './Summary';
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
        discount: data.discount,
      });
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  useEffect(() => {
    fetchArtwork();
  }, []);

  return (
    <Container fixed className={classes.fixed}>
      <Grid container className={classes.container} spacing={2}>
        {state.loading ? (
          <Grid item xs={12} className={classes.loader}>
            <CircularProgress />
          </Grid>
        ) : state.artwork._id ? (
          <>
            <StateProvider
              definedState={{
                main: {
                  artwork: state.artwork,
                  discount: state.discount,
                  step: 0,
                },
                formValues: {
                  licenses: [],
                  date: '',
                  firstname: '',
                  lastname: '',
                  email: '',
                  address: '',
                  zip: '',
                  city: '',
                  country: '',
                },
              }}
            >
              <Grid item xs={12} md={8} className={classes.artwork}>
                <Main />
              </Grid>
              <Grid item xs={12} md={4} className={classes.actions}>
                <Summary />
                <br />
              </Grid>
            </StateProvider>
          </>
        ) : (
          history.push('/')
        )}
      </Grid>
    </Container>
  );
};

export default Checkout;
