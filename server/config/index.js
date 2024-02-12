const _ = require("lodash");
var defaultConfig = require("./config");
var dbConnection = require("./dbConnection");
var cfg = {};
var environment = process.env.NODE_ENV || "local";
const dotenv = require('dotenv');
dotenv.config();

// ENV Config
switch (environment) {
  case "local":
  case "localhost":
    envConfig = require("./env/local");
    break;
}

// Create Final Config JSON by extending env from default
cfg = _.extend(defaultConfig, envConfig);

// ========================== Export Module Start ==========================
module.exports = {
  cfg,
  dbConnection,
};
// ========================== Export Module End ============================
