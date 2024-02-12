const jwt = require("jsonwebtoken");
const config = require("../config").cfg;
const customExceptions = require("../responseModels/customExceptions");
const responseHandler = require("../utils/responseHandler");
const { USER_ROLE } = require("../constants/dbConstants");
const authenticateToken = async (req, res, next) => {
  try {
    let acsToken = req.get("accessToken");
    if (!acsToken) {
      throw customExceptions.noTokenSupplied();
    }
    const secret = "fe1a1915a379f3be5394b64d14794932"; //!D -->> keep in env
    req.claims = jwt.verify(acsToken, secret);

    if (req?.claims?.user?._id) {
      next();
    } else {
      throw customExceptions.completeCustomException(0, "Forbidden", {});
    }
  } catch (err) {
    return responseHandler.sendError(res, err, req);
  }
};

const checkSuperAdmin = async (req, res, next) => {
  try {
    if (
      req?.claims?.user?._id &&
      USER_ROLE.SuperAdmin == req.claims.user.role
    ) {
      next();
    } else {
      throw customExceptions.completeCustomException(0, "Forbidden", {});
    }
  } catch (err) {
    return responseHandler.sendError(res, err, req);
  }
};

const checkAdmin = async (req, res, next) => {
  try {
    if (
      req?.claims?.user?._id &&
      (USER_ROLE.SuperAdmin == req.claims.user.role ||
        USER_ROLE.Admin == req.claims.user.role)
    ) {
      next();
    } else {
      throw customExceptions.completeCustomException(0, "Forbidden", {});
    }
  } catch (err) {
    return responseHandler.sendError(res, err, req);
  }
};

const checkInstructor = async (req, res, next) => {
  try {
    if (
      req?.claims?.user?._id &&
      (USER_ROLE.SuperAdmin == req.claims.user.role ||
        USER_ROLE.Admin == req.claims.user.role ||
        USER_ROLE.Instructor == req.claims.user.role)
    ) {
      next();
    } else {
      throw customExceptions.completeCustomException(0, "Forbidden", {});
    }
  } catch (err) {
    return responseHandler.sendError(res, err, req);
  }
};

const checkSiteManager = async (req, res, next) => {
  try {
    if (
      req?.claims?.user?._id &&
      (USER_ROLE.SuperAdmin == req.claims.user.role ||
        USER_ROLE.Admin == req.claims.user.role ||
        USER_ROLE.SiteManager == req.claims.user.role )
    ) {
      next();
    } else {
      throw customExceptions.completeCustomException(0, "Forbidden", {});
    }
  } catch (err) {
    return responseHandler.sendError(res, err, req);
  }
};


const checkInstructorORSiteManager = async (req, res, next) => {
  try {
    if (
      req?.claims?.user?._id &&
      (USER_ROLE.SuperAdmin == req.claims.user.role ||
        USER_ROLE.Admin == req.claims.user.role ||
        USER_ROLE.Instructor == req.claims.user.role ||
        USER_ROLE.SiteManager == req.claims.user.role )
    ) {
      next();
    } else {
      throw customExceptions.completeCustomException(0, "Forbidden", {});
    }
  } catch (err) {
    return responseHandler.sendError(res, err, req);
  }
};

module.exports = {
  authenticateToken,
  checkSuperAdmin,
  checkInstructor,
  checkAdmin,
  checkInstructorORSiteManager,
  checkSiteManager
};
