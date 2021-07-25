import React, { useEffect } from "react";
import MainHeading from "../../components/MainHeading";
import CheckoutContent from "../../containers/CheckoutContent";
import { useOrderCheckout } from "../../contexts/local/orderCheckout";
import Container from "../../domain/Container";
import { containsErrors, renderError } from "../../utils/helpers";

const Checkout = ({ location }) => {
  const retry = useOrderCheckout((state) => state.version.error.retry);
  const redirect = useOrderCheckout((state) => state.version.error.redirect);
  const message = useOrderCheckout((state) => state.version.error.message);
  const resetArtwork = useOrderCheckout((state) => state.resetArtwork);

  const reinitializeState = () => {
    resetArtwork();
  };

  useEffect(() => {
    return () => {
      reinitializeState();
    };
  }, []);

  return !containsErrors(retry, redirect) ? (
    <Container key={location.key}>
      <MainHeading text={"Checkout"} />
      <CheckoutContent />
    </Container>
  ) : (
    renderError({ retry, redirect, message, reinitializeState })
  );
};

export default Checkout;
