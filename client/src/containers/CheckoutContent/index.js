import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import { stripe } from "../../../../config/secret";
import CheckoutProcessor from "../CheckoutProcessor";

const stripePromise = stripe.publishableKey
  ? loadStripe(stripe.publishableKey)
  : null;

const CheckoutContent = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutProcessor />
    </Elements>
  );
};

export default CheckoutContent;
