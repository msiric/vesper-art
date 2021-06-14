import React, { useEffect } from "react";
import MainHeading from "../../components/MainHeading";
import CheckoutContent from "../../containers/CheckoutContent";
import { useOrderCheckout } from "../../contexts/local/orderCheckout";
import Container from "../../domain/Container";

const Checkout = ({ location }) => {
  const resetArtwork = useOrderCheckout((state) => state.resetArtwork);

  const reinitializeState = () => {
    resetArtwork();
  };

  useEffect(() => {
    return () => {
      reinitializeState();
    };
  }, []);

  return (
    <Container key={location.key}>
      <MainHeading text={"Checkout"} />
      <CheckoutContent />
    </Container>
  );
};

export default Checkout;
