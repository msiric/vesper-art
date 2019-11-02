module.exports = {
  database: `mongodb+srv://${process.env.DEV_DB_USER}:${process.env.DEV_DB_PASS}@${process.env.DEV_DB_NAME}-5nkas.mongodb.net/test?retryWrites=true&w=majority`,
  port: process.env.PORT || 3000,
  secret: process.env.SECRET || 'fiverrclone'
};

// id: AKIA4Q7VKJEHPPHYS3HX
// secret: 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
