import Stripe from 'stripe';
import { stripe as stripeConfig } from '../config/secret';
// The portfolio demo must never initialize a real payment connection.
export const stripe = process.env.DEMO_MODE === 'true' ? null : stripeConfig.secretKey ? new Stripe(stripeConfig.secretKey) : null;
