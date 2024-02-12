const { STATUS_CODE } = require("../constants/responseConstants");
const APIResponse = require("../responseModels/APIResponse");
// const logger = require("../logger").logger;

const sendSuccess = (response, result, request) => {
  var result = new APIResponse(STATUS_CODE.SUCCESS, result, request);
  let statusCode = result.statusCode || 200;
  _sendResponse(response, result, statusCode);
};

const _sendResponse = (response, result, statusCode) => {
  // result.status = statusCode;
  return response.send(result);
};

const sendError = (response, error, request) => {
  if (!error.errorCode) {
    console.log(error, ":::Unhandled error.");
    // logger.error(error, ":::Unhandled error.");
  }
  var result = new APIResponse(STATUS_CODE.ERROR, error, request);
  let statusCode = error.statusCode || 400;
  _sendResponse(response, result, statusCode);
};

function handleError(error, request, response, next) {
  // unhandled error
  sendError(response, error, request);
}

module.exports = { sendSuccess, sendError, handleError };
