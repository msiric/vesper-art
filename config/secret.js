module.exports.mongo = {
  database: `mongodb+srv://${process.env.DEV_DB_USER}:${process.env.DEV_DB_PASS}@${process.env.DEV_DB_NAME}-5nkas.mongodb.net/test?retryWrites=true&w=majority`,
  secret: process.env.SECRET || 'fiverrclone'
};

module.exports.server = {
  appName: 'Blabla',
  port: process.env.PORT || 3000
};
// id: AKIA4Q7VKJEHPPHYS3HX
// secret: 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

module.exports.stripe = {
  secretKey: process.env.STRIPE_SECRET,
  publishableKey: process.env.STRIPE_PUBLISH,
  clientId: 'YOUR_STRIPE_CLIENT_ID',
  authorizeUri: 'https://connect.stripe.com/express/oauth/authorize',
  tokenUri: 'https://connect.stripe.com/oauth/token'
};
