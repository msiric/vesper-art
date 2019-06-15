module.exports = {
  database:
    process.env.DATABASE ||
    'mongodb://root:rP%40gZ(96)ob@fiverr-demo-shard-00-00-5nkas.mongodb.net:27017,fiverr-demo-shard-00-01-5nkas.mongodb.net:27017,fiverr-demo-shard-00-02-5nkas.mongodb.net:27017/test?ssl=true&replicaSet=fiverr-demo-shard-0&authSource=admin&retryWrites=true&w=majority',
  port: process.env.PORT || 3000,
  secret: process.env.SECRET || 'fiverrclone'
};
