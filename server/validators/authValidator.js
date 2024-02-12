const customExceptions = require("../responseModels/customExceptions");
const { USER_ROLE, OTP_TYPE } = require("../constants/dbConstants");

const logIn = (req, res, next) => {
  let { password, phoneNumberOrEmail } = req.body;
  let errors = [];

  if (!phoneNumberOrEmail) {
    let errorMessage = "Email Or Phone Number is require";
    errors.push({ errorMessage });
  }

  if (!password) {
    let errorMessage = "Password is require";
    errors.push({ errorMessage });
  }

  if (errors.length) {
    throw next(
      customExceptions.completeCustomException(0, "Validation Error", errors)
    );
  }
  next();
};

const register = (req, res, next) => {
  let { name, email, role, phoneNumber, password, profession, city } = req.body;
  let errors = [];

  if (!name) {
    let errorMessage = "Name is require";
    errors.push({ errorMessage });
  }
  if (!email) {
    let errorMessage = "Email is require";
    errors.push({ errorMessage });
  }

  if (!role) {
    let errorMessage = "Role is require";
    errors.push({ errorMessage });
  } else {
    let rolesAllowed = [
      USER_ROLE.Student,
      USER_ROLE.Instructor,
      USER_ROLE.Admin,
      USER_ROLE.SiteManager,
    ];
    if (!rolesAllowed.includes(role)) {
      let errorMessage = "Role is not allowed";
      errors.push({ errorMessage });
    }
  }

  if (!email) {
    let errorMessage = "Email is require";
    errors.push({ errorMessage });
  }

  if (!phoneNumber) {
    let errorMessage = "Phone Number is require";
    errors.push({ errorMessage });
  }

  if (!password) {
    let errorMessage = "Password is require";
    errors.push({ errorMessage });
  }

  if (errors.length) {
    throw next(
      customExceptions.completeCustomException(0, "Validation Error", errors)
    );
  }
  next();
};

const sendOTP = (req, res, next) => {
  let { type, phoneNumberOrEmail } = req.body;
  let errors = [];

  if (!phoneNumberOrEmail) {
    let errorMessage = "Email Or Phone Number is require";
    errors.push({ errorMessage });
  }

  if (!type) {
    let errorMessage = "Type is require";
    errors.push({ errorMessage });
  } else if (!OTP_TYPE.includes(type)) {
    let errorMessage = "Type is not correct";
    errors.push({ errorMessage });
  }

  if (errors.length) {
    throw next(
      customExceptions.completeCustomException(0, "Validation Error", errors)
    );
  }
  next();
};

const logInWithOtp = (req, res, next) => {
  let { otp, id } = req.body;
  let errors = [];

  if (!otp) {
    let errorMessage = "Otp is require";
    errors.push({ errorMessage });
  }

  if (!id) {
    let errorMessage = "Id is require";
    errors.push({ errorMessage });
  }

  if (errors.length) {
    throw next(
      customExceptions.completeCustomException(0, "Validation Error", errors)
    );
  }
  next();
};

const forgetpassword = (req, res, next) => {
  let { otp, id, password } = req.body;
  let errors = [];

  if (!otp) {
    let errorMessage = "Otp is require";
    errors.push({ errorMessage });
  }

  if (!id) {
    let errorMessage = "Id is require";
    errors.push({ errorMessage });
  }

  if (!password) {
    let errorMessage = "Password is require";
    errors.push({ errorMessage });
  }

  if (errors.length) {
    throw next(
      customExceptions.completeCustomException(0, "Validation Error", errors)
    );
  }
  next();
};

module.exports = {
  logIn,
  register,
  sendOTP,
  logInWithOtp,
  forgetpassword,
};
