module.exports = {
  ENVIRONMENT: process.env.ENVIRONMENT || "local",
  PORT: process.env.PORT || 3001,
  PROJECT_NAME: process.env.PROJECT_NAME,
  MONGO_CONNECTION_STRING: process.env.MONGO_CONNECTION_STRING,
  AWS_KEY: "",
  AWS_SECRET: "",
  AWS_REGION: "",
  AWS_BUCKET: "",
  AWS_LOG_BUCKET: "",
  REDIS_HOST: "",
  REDIS_PORT: 6379,
};