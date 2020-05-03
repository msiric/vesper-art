const stripe = require('stripe')(process.env.STRIPE_SECRET);
const { isAuthenticated } = require('../../../utils/helpers');
const router = require('express').Router();
const config = require('./config/secret');

/**
 * GET /pilots/dashboard
 *
 * Show the Dashboard for the logged-in pilot with the overview,
 * their ride history, and the ability to simulate a test ride.
 *
 * Use the `pilotRequired` middleware to ensure that only logged-in
 * pilots can access this route.
 */
// treba sredit sve
router.get('/dashboard', isAuthenticated, async (req, res) => {
  // Retrieve the balance from Stripe
  const balance = await stripe.balance.retrieve({
    stripe_account: req.user.stripeId,
  });
  // Fetch the pilot's recent rides
  const rides = await req.user.listRecentRides();
  const ridesTotalAmount = rides.reduce((a, b) => {
    return a + b.amountForPilot();
  }, 0);
  // There is one balance for each currencies used: as this
  // demo app only uses USD we'll just use the first object
  res.render('dashboard', {
    pilot: req.user,
    balanceAvailable: balance.available[0].amount,
    balancePending: balance.pending[0].amount,
    ridesTotalAmount: ridesTotalAmount,
    rides: rides,
    showBanner: !!showBanner || req.query.showBanner,
  });
});

router.post('/rides', isAuthenticated, async (req, res, next) => {
  // Find a random passenger
  const passenger = await Passenger.getRandom();
  // Create a new ride for the pilot and this random passenger
  const ride = new Ride({
    pilot: req.user.id,
    passenger: passenger.id,
    // Generate a random amount between $10 and $100 for this ride
    amount: getRandomInt(1000, 10000),
  });
  // Save the ride
  await ride.save();
  try {
    // Get a test source, using the given testing behavior
    let source;
    if (req.body.immediate_balance) {
      source = getTestSource('immediate_balance');
    } else if (req.body.payout_limit) {
      source = getTestSource('payout_limit');
    }
    // Create a charge and set its destination to the pilot's account
    const charge = await stripe.charges.create({
      source: source,
      amount: ride.amount,
      currency: ride.currency,
      description: config.appName,
      statement_descriptor: config.appName,
      // The destination parameter directs the transfer of funds from platform to pilot
      transfer_data: {
        // Send the amount for the pilot after collecting a 20% platform fee:
        // the `amountForPilot` method simply computes `ride.amount * 0.8`
        amount: ride.amountForPilot(),
        // The destination of this charge is the pilot's Stripe account
        destination: req.user.stripeId,
      },
    });
    // Add the Stripe charge reference to the ride and save it
    ride.stripeChargeId = charge.id;
    ride.save();
  } catch (err) {
    console.log(err);
    // Return a 402 Payment Required error code
    res.sendStatus(402);
    next(`Error adding token to customer: ${err.message}`);
  }
  res.redirect('/pilots/dashboard');
});

// Function that returns a test card token for Stripe
function getTestSource(behavior) {
  // Important: We're using static tokens based on specific test card numbers
  // to trigger a special behavior. This is NOT how you would create real payments!
  // You should use Stripe Elements or Stripe iOS/Android SDKs to tokenize card numbers.
  // Use a static token based on a test card: https://stripe.com/docs/testing#cards
  var source = 'tok_visa';
  // We can use a different test token if a specific behavior is requested
  if (behavior === 'immediate_balance') {
    source = 'tok_bypassPending';
  } else if (behavior === 'payout_limit') {
    source = 'tok_visa_triggerTransferBlock';
  }
  return source;
}

// Return a random int between two numbers
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = router;