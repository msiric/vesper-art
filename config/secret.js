export const mongo = {
  database: `mongodb+srv://${process.env.DEV_DB_USER}:${process.env.DEV_DB_PASS}@${process.env.DEV_DB_NAME}-5nkas.mongodb.net/test?retryWrites=true&w=majority`,
  secret: process.env.DEV_DB_SECRET,
};

export const server = {
  appName: process.env.APP,
  clientDomain: process.env.DOMAIN || 'http://localhost:3000',
  serverDomain: process.env.DOMAIN || 'http://localhost:5000',
  port: process.env.PORT || 5000,
};

export const stripe = {
  secretKey: process.env.STRIPE_SECRET,
  publishableKey: process.env.STRIPE_PUBLISH,
  clientId: process.env.STRIPE_CLIENT,
  authorizeUri: 'https://connect.stripe.com/express/oauth/authorize',
  tokenUri: 'https://connect.stripe.com/oauth/token',
};

export const mailer = {
  email: process.env.MAILER_MAIL,
  password: process.env.MAILER_PASS,
};
