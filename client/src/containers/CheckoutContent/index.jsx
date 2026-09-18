import { stripePublishableKey } from "@shared/constants";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import CheckoutProcessor from "../CheckoutProcessor";

const stripePromise = loadStripe(stripePublishableKey);

const CheckoutContent = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutProcessor />
    </Elements>
  );
};

export default CheckoutContent;
