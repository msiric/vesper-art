import { Box, Button, Container, Grid } from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { format } from "date-fns";
import { Field, Form, Formik } from "formik";
import queryString from "query-string";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory, withRouter } from "react-router-dom";
import * as Yup from "yup";
import OrderCard from "../../components/OrderCard/index.js";
import ProfileCard from "../../components/ProfileCard/index.js";
import LicenseCard from "../../containers/LicenseCard/index.js";
import OrderPreview from "../../containers/OrderPreview/index.js";
import ReviewCard from "../../containers/ReviewCard/index.js";
import { UserContext } from "../../contexts/User.js";
import { getDownload, getOrder, postReview } from "../../services/orders.js";
import Modal from "../../shared/Modal/Modal.js";
import globalStyles from "../../styles/global.js";

const reviewValidation = Yup.object().shape({
  rating: Yup.number().min(1).max(5).required("Rating cannot be empty"),
});

const initialState = {
  loading: true,
  order: { version: {}, seller: {}, buyer: {}, license: {}, review: {} },
  modal: {
    open: false,
    body: ``,
  },
};

const Order = ({ match, location }) => {
  const [userStore] = useContext(UserContext);
  const [state, setState] = useState({ ...initialState });
  const globalClasses = globalStyles();

  const highlightRef = useRef(null);
  const query = queryString.parse(location.search);

  const history = useHistory();

  const modalBody = () => {
    return (
      <Box>
        <Formik
          initialValues={{
            rating: 0,
          }}
          enableReinitialize
          validationSchema={reviewValidation}
          onSubmit={async (values, { resetForm }) => {
            await postReview.request({
              artworkId: state.order._id,
              reviewRating: values.rating,
            });
            setState((prevState) => ({
              ...prevState,
              order: {
                ...prevState.order,
                review: {
                  order: prevState.order._id,
                  artwork: prevState.order.artwork._id,
                  owner: userStore.id,
                  rating: values.rating,
                },
              },
            }));
            handleModalClose();
          }}
        >
          {({ values, errors, touched }) => (
            <Form>
              <Box>
                <Field name="rating">
                  {({
                    field,
                    form: { touched, errors, setFieldValue },
                    meta,
                  }) => <Rating {...field} />}
                </Field>
              </Box>
              <Box>
                <Button type="submit" color="primary" fullWidth>
                  Publish
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    );
  };

  const scrollToHighlight = () => {
    if (highlightRef.current)
      highlightRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
  };

  const fetchOrder = async () => {
    try {
      setState({ ...initialState });
      const { data } = await getOrder.request({ orderId: match.params.id });
      setState((prevState) => ({
        ...prevState,
        loading: false,
        tab: 0,
        order: data.order,
      }));
      if (query && query.notif === "review") {
        scrollToHighlight();
      }
    } catch (err) {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  const handleModalOpen = () => {
    setState((prevState) => ({
      ...prevState,
      modal: {
        ...prevState.modal,
        open: true,
        body: modalBody(),
      },
    }));
  };

  const handleModalClose = () => {
    setState((prevState) => ({
      ...prevState,
      modal: {
        ...prevState.modal,
        open: false,
        body: ``,
      },
    }));
  };

  const handleDownload = async () => {
    try {
      const { data } = await getDownload.request({ orderId: state.order._id });
      const link = document.createElement("a");
      link.href = data.url;
      link.setAttribute("download", data.file);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.log(err);
    }
  };

  const formatDate = (date, type) => {
    return format(new Date(date), type);
  };

  const isSeller = () =>
    state.order._id &&
    userStore.id.toString() === state.order.seller._id.toString();

  const isBuyer = () =>
    state.order._id &&
    userStore.id.toString() === state.order.buyer._id.toString();

  useEffect(() => {
    fetchOrder();
  }, [location]);

  return (
    <Container key={location.key} className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        {state.loading || state.order._id ? (
          <>
            <Grid item xs={12}>
              <OrderPreview
                version={state.order.version}
                handleDownload={handleDownload}
                shouldDownload={!isSeller() && isBuyer()}
                loading={state.loading}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ProfileCard
                user={
                  !isSeller() && isBuyer()
                    ? state.order.seller
                    : state.order.buyer
                }
                loading={state.loading}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <OrderCard
                order={state.order}
                isSeller={isSeller}
                loading={state.loading}
              />
              <br />
              <LicenseCard
                license={state.order.license}
                loading={state.loading}
              />
              <br />
              <ReviewCard
                handleModalOpen={handleModalOpen}
                review={state.order.review}
                shouldReview={!isSeller() && isBuyer()}
                queryNotif={query ? query.notif : null}
                highlightRef={highlightRef}
                loading={state.loading}
              />
            </Grid>
          </>
        ) : (
          history.push("/")
        )}
      </Grid>
      <Modal {...state.modal} handleClose={handleModalClose} />
    </Container>
  );
};

export default withRouter(Order);
