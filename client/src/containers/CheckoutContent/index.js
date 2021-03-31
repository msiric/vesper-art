import { Elements } from "@stripe/react-stripe-js";
import React, { useEffect } from "react";
import CheckoutProcessor from "../../containers/CheckoutProcessor";
import { useOrderStripe } from "../../contexts/local/orderStripe";

const CheckoutContent = ({ match }) => {
  const stripe = useOrderStripe((state) => state.stripe.data);
  const loading = useOrderStripe((state) => state.stripe.loading);
  const fetchStripe = useOrderStripe((state) => state.fetchStripe);

  useEffect(() => {
    fetchStripe();
  }, []);

  return (
    <Elements stripe={stripe}>
      <CheckoutProcessor stripe={stripe} />
    </Elements>
  );
};

export default CheckoutContent;
