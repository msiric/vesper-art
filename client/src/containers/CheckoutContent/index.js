import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import { stripe } from "../../../../config/secret";
import CheckoutProcessor from "../CheckoutProcessor";

const stripePromise = loadStripe(
  stripe.publishableKey || "pk_test_xi0qpLTPs3WI8YPUfTyeeyzt00tNwou20z"
);

const CheckoutContent = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutProcessor />
    </Elements>
  );
};

export default CheckoutContent;
