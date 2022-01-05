import Stripe from "stripe";
import { stripe as stripeConfig } from "../config/secret";

export const stripe = Stripe(stripeConfig.secretKey);
