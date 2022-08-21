import React, { useEffect } from "react";
import MainHeading from "../../components/MainHeading";
import CheckoutContent from "../../containers/CheckoutContent";
import { useOrderCheckout } from "../../contexts/local/orderCheckout";
import Container from "../../domain/Container";
import globalStyles from "../../styles/global";
import { containsErrors, renderError } from "../../utils/helpers";

const Checkout = ({ location }) => {
  const versionRetry = useOrderCheckout((state) => state.version.error.retry);
  const versionRedirect = useOrderCheckout(
    (state) => state.version.error.redirect
  );
  const versionMessage = useOrderCheckout(
    (state) => state.version.error.message
  );
  const ordersRetry = useOrderCheckout((state) => state.orders.error.retry);
  const ordersRedirect = useOrderCheckout(
    (state) => state.orders.error.redirect
  );
  const ordersMessage = useOrderCheckout((state) => state.orders.error.message);
  const resetArtwork = useOrderCheckout((state) => state.resetArtwork);

  const globalClasses = globalStyles();

  const reinitializeState = () => {
    resetArtwork();
  };

  useEffect(() => {
    return () => {
      reinitializeState();
    };
  }, []);

  return !containsErrors(
    versionRetry,
    versionRedirect,
    ordersRetry,
    ordersRedirect
  ) ? (
    <Container key={location.key} className={globalClasses.gridContainer}>
      <MainHeading text="Checkout" />
      <CheckoutContent />
    </Container>
  ) : (
    renderError(
      {
        retry: versionRetry,
        redirect: versionRedirect,
        message: versionMessage,
        reinitializeState,
      },
      {
        retry: ordersRetry,
        redirect: ordersRedirect,
        message: ordersMessage,
        reinitializeState,
      }
    )
  );
};

export default Checkout;
