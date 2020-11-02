import { Container, Grid } from "@material-ui/core";
import { format } from "date-fns";
import queryString from "query-string";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory, withRouter } from "react-router-dom";
import EmptySection from "../../components/EmptySection/index.js";
import OrderCard from "../../components/OrderCard/index.js";
import ProfileCard from "../../components/ProfileCard/index.js";
import RatingModal from "../../components/RatingModal/index.js";
import LicenseCard from "../../containers/LicenseCard/index.js";
import OrderPreview from "../../containers/OrderPreview/index.js";
import ReviewCard from "../../containers/ReviewCard/index.js";
import { UserContext } from "../../contexts/User.js";
import { getDownload, getOrder, postReview } from "../../services/orders.js";
import globalStyles from "../../styles/global.js";

const initialState = {
  loading: true,
  order: { version: {}, seller: {}, buyer: {}, license: {}, review: {} },
  modal: {
    open: false,
  },
};

const Order = ({ match, location }) => {
  const [userStore] = useContext(UserContext);
  const [state, setState] = useState({ ...initialState });
  const globalClasses = globalStyles();

  const highlightRef = useRef(null);
  const query = queryString.parse(location.search);

  const history = useHistory();

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
      },
    }));
  };

  const handleModalClose = () => {
    setState((prevState) => ({
      ...prevState,
      modal: {
        ...prevState.modal,
        open: false,
      },
    }));
  };

  const handleArtworkDownload = async () => {
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

  const handleRatingSubmit = async (values) => {
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
            <Grid item xs={12} md={8}>
              <OrderPreview
                version={state.order.version}
                handleDownload={handleArtworkDownload}
                shouldDownload={!isSeller() && isBuyer()}
                loading={state.loading}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <ProfileCard
                user={
                  !isSeller() && isBuyer()
                    ? state.order.seller
                    : state.order.buyer
                }
                styles={{ height: "65%" }}
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
            <Grid item xs={12}>
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
            </Grid>
          </>
        ) : (
          <EmptySection label="Order not found" page />
        )}
      </Grid>
      <RatingModal
        open={state.modal.open}
        handleConfirm={handleRatingSubmit}
        handleClose={handleModalClose}
        ariaLabel="Artist rating"
        promptTitle="Rate artist"
        promptConfirm="Submit"
        promptCancel="Cancel"
      />
    </Container>
  );
};

export default withRouter(Order);
