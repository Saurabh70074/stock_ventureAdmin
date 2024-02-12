var jwt = require("jwt-simple");
var secret = "fe1a1915a379f3be5394b64d14794932"; //!D -->> keep in env

const logInFunction = async (parms) => {
  let payload = { user : parms };
  parms.password = undefined;

  let token = {
    token: jwt.encode(payload, secret),
    user : parms,
  };
  //!D save token
  return token;
};

const verifyToken = async (token) => {
  var decoded = jwt.decode(token, secret);
  return decoded;
};

module.exports = {
  logInFunction,
  verifyToken,
};
