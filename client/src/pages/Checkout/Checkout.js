import { Container } from "@material-ui/core";
import React from "react";
import MainHeading from "../../components/MainHeading";
import CheckoutContent from "../../containers/CheckoutContent";

const Checkout = ({ location }) => {
  return (
    <Container key={location.key}>
      <MainHeading text={"Checkout"} />
      <CheckoutContent />
    </Container>
  );
};

export default Checkout;
