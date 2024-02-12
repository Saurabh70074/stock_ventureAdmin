// Load exceptions
var Exception = require("./Exception");
var constants = require("../constants/responseConstants");
//========================== Load Modules End =============================

//========================== Export Module Start ===========================
module.exports = {
  completeCustomException: (errcode, errMsg, error) => {
    if (error == false) return new Exception(errcode, errMsg);
    else return new Exception(errcode, errMsg, error);
  },
  intrnlSrvrErr: (err) => {
    return new Exception(1, constants.MESSAGES.INTERNAL_SERVER_ERROR, err);
  },
  incorrectPassword: (err) => {
    return new Exception(2, constants.MESSAGES.PASSWORD_INCORRECT, err);
  },
  noTokenSupplied: (err) => {
    return new Exception(3, constants.MESSAGES.NO_TOKEN_SUPPLIED, err);
  },
  userExist: (err) => {
    return new Exception(
      4,
      constants.MESSAGES.EMAIL_OR_PHONE_NUMBER_EXIST,
      err
    );
  },
  userNotExist: (err) => {
    return new Exception(
      5,
      constants.MESSAGES.EMAIL_OR_PHONE_NUMBER_NOT_EXIST,
      err
    );
  },
};
