const express = require("express");
var _ = require("lodash");
const router = express.Router();
const otpGenerator = require("otp-generator");
const fetch = require("node-fetch");
const authControls = require("../controllers/authControls");
const courseControls = require("../controllers/courseControls");

const auth = require("../middlewares/auth");
const responseHandler = require("../utils/responseHandler");
const customExceptions = require("../responseModels/customExceptions");
const {
  logIn,
  register,
  sendOTP,
  logInWithOtp,
  forgetpassword,
} = require("../validators/authValidator");
const { encryptPassword, comparePassword } = require("../utils/utils");
const { logInFunction } = require("../functions/authFunction");
const { OTP_TYPE, USER_ROLE } = require("../constants/dbConstants");

//#region Auth
router.post("/login", [logIn], async (req, res) => {
  let { password, phoneNumberOrEmail } = req.body;
  try {
    let user = await authControls.getUserByEmailOrPhoneNumber(
      phoneNumberOrEmail
    );

    if (!user) {
      throw customExceptions.userNotExist({});
    }

    let passwordCheck = await comparePassword(password, user.password);
    if (passwordCheck) {
      let response = await logInFunction(user);
      return responseHandler.sendSuccess(res, response, req);
    } else {
      throw customExceptions.incorrectPassword({});
    }
  } catch (error) {
    console.log("error --", error);
    return responseHandler.sendError(res, error, req);
  }
});

router.post("/sendotp", [sendOTP], async (req, res) => {
  let { type, phoneNumberOrEmail } = req.body;
  try {
    let user = await authControls.getUserByEmailOrPhoneNumber(
      phoneNumberOrEmail
    );

    if (!user) {
      throw customExceptions.userNotExist({});
    }
    let otp = otpGenerator.generate(4, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    if (phoneNumberOrEmail.includes("@")) {
      console.log(
        "################## Mail this otp ####################################################### ",
        otp
      );
    } else {
      let URL = `https://api.msg91.com/api/v5/otp?template_id=63cbb416d6fc0547c804fe73&mobile=+91${phoneNumberOrEmail}&authkey=383767A9KyizywJ2634d0442P1&otp=${otp}&extra_param={"var":"9795333516"}`;

      const response = await fetch(URL, {
        method: "get",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      console.log(
        "################# Phone this otp ####################################################### ",
        otp
      );
    }
    let response = await authControls.addUserOTP({
      phoneNumberOrEmail,
      type,
      otp,
    });
    response.otp = "Otp Send";
    return responseHandler.sendSuccess(res, response, req);
  } catch (error) {
    console.log("error --", error);
    return responseHandler.sendError(res, error, req);
  }
});

router.post("/loginwithotp", [logInWithOtp], async (req, res) => {
  let { otp, id } = req.body;
  try {
    let userotp = await authControls.findUserOtpById({ id });

    if (!userotp) {
      throw customExceptions.completeCustomException(0, "Otp is not send");
    } else if (userotp.otp != otp || OTP_TYPE[0] != userotp.type) {
      throw customExceptions.completeCustomException(0, "Otp is not correct");
    } else if (userotp.isDeleted) {
      throw customExceptions.completeCustomException(0, "Otp is already Used");
    }

    let user = await authControls.getUserByEmailOrPhoneNumber(
      userotp.phoneNumberOrEmail
    );

    let response = await logInFunction(user);
    authControls.deleteUserOtp({ id });
    return responseHandler.sendSuccess(res, response, req);
  } catch (error) {
    console.log("error --", error);
    return responseHandler.sendError(res, error, req);
  }
});

router.post("/register", [register], async (req, res) => {
  let { name, email, role, phoneNumber, password, profession, city } = req.body;
  try {
    let user = await authControls.getUserByEmailOrPhoneNumber(
      email,
      phoneNumber
    );
    if (!user) {
      password = await encryptPassword(password);
      user = await authControls.addUser({
        name,
        email,
        role,
        phoneNumber,
        password,
        profession,
        city,
      });
      user = await authControls.getUserByEmailOrPhoneNumber(email, phoneNumber);
      await authControls.addUserProfile({
        about: user.name,
        userId: user.id,
      });
      let response = await logInFunction(user);
      responseHandler.sendSuccess(res, response, req);
    } else {
      throw customExceptions.userExist({});
    }
  } catch (error) {
    return responseHandler.sendError(res, error, req);
  }
});

router.post("/forgetpassword", [forgetpassword], async (req, res) => {
  let { otp, id, password } = req.body;
  try {
    let userotp = await authControls.findUserOtpById({ id });

    if (!userotp) {
      throw customExceptions.completeCustomException(0, "Otp is not send");
    } else if (userotp.otp != otp || OTP_TYPE[1] != userotp.type) {
      throw customExceptions.completeCustomException(0, "Otp is not correct");
    } else if (userotp.isDeleted) {
      throw customExceptions.completeCustomException(0, "Otp is already Used");
    }

    let user = await authControls.getUserByEmailOrPhoneNumber(
      userotp.phoneNumberOrEmail
    );
    password = await encryptPassword(password);

    let updateUser = await authControls.updateUser({
      id: user._id,
      password,
    });

    authControls.deleteUserOtp({ id });
    return responseHandler.sendSuccess(res, { msg: "password updated" }, req);
  } catch (error) {
    console.log("error --", error);
    return responseHandler.sendError(res, error, req);
  }
});

router.post("/changepassword", [auth.authenticateToken], async (req, res) => {
  let { oldpassword, newpassword } = req.body;
  try {
    let userId = req.claims.user._id;
    let user = await authControls.getUserById(userId);

    if (!user) {
      throw customExceptions.userNotExist({});
    }

    let passwordCheck = await comparePassword(oldpassword, user.password);
    if (!passwordCheck) {
      return responseHandler.sendSuccess(
        res,
        { msg: "Old password is incorrect" },
        req
      );
    }

    newpassword = await encryptPassword(newpassword);

    let updateUser = await authControls.updateUser({
      id: userId,
      password: newpassword,
    });

    return responseHandler.sendSuccess(res, { msg: "password updated" }, req);
  } catch (error) {
    console.log("error --", error);
    return responseHandler.sendError(res, error, req);
  }
});

//#endregion

//#region User Admin
router.get(
  "/admin/list",
  [auth.authenticateToken, auth.checkInstructor],
  async (req, res) => {
    try {
      let response = await authControls.userListAdmin();
      return responseHandler.sendSuccess(res, response, req);
    } catch (error) {
      return responseHandler.sendError(res, error, req);
    }
  }
);

router.post("/superadmin/add", async (req, res) => {
  let { email, name, phoneNumber, secretKey } = req.body;
  try {
    if (secretKey !== "1234567")
      return responseHandler.sendError(res, "Cannot add", req);
    let role = USER_ROLE.SuperAdmin;
    let result = await authControls.addUser({ email, name, phoneNumber, role });
    await authControls.addUserProfile({
      about: result.name,
      userId: result.id,
    });
    let response = {
      message: "Super Admin added successfully!",
      result,
    };
    return responseHandler.sendSuccess(res, response, req);
  } catch (error) {
    return responseHandler.sendError(res, error, req);
  }
});

router.post(
  "/admin/add",
  [auth.authenticateToken, auth.checkAdmin],
  async (req, res) => {
    let { email, name, phoneNumber, role } = req.body;
    try {
      let userEmail = await authControls.getUserByEmailOrPhoneNumber(email);

      if (userEmail) {
        let responseV = {
          message: "Email already exists",
        };
        return responseHandler.sendSuccess(res, responseV, req);
      }
      let userPhoneNumber = await authControls.getUserByEmailOrPhoneNumber(
        email,
        phoneNumber
      );

      if (userPhoneNumber) {
        let responseV = {
          message: "Phone Number already exists",
        };
        return responseHandler.sendSuccess(res, responseV, req);
      }
      let result = await authControls.addUser({
        email,
        name,
        phoneNumber,
        role,
      });
      await authControls.addUserProfile({
        about: result.name,
        userId: result.id,
      });
      let response = {
        message: "User added successfully!",
        result,
      };
      return responseHandler.sendSuccess(res, response, req);
    } catch (error) {
      return responseHandler.sendError(
        res,
        { msg: "Please Email or phone number already exist!", error },
        req
      );
    }
  }
);

router.put(
  "/admin/edit/:id",
  [auth.authenticateToken, auth.checkAdmin],
  async (req, res) => {
    let { id } = req.params;
    let { email, name, phoneNumber, role } = req.body;
    try {
      let userEmail = await authControls.getUserByEmailOrPhoneNumber(email);

      if (userEmail && userEmail._id != id) {
        let responseV = {
          message: "Email already exists",
        };
        return responseHandler.sendSuccess(res, responseV, req);
      }

      let userPhoneNumber = await authControls.getUserByEmailOrPhoneNumber(
        email,
        phoneNumber
      );

      if (userPhoneNumber && userPhoneNumber._id != id) {
        let responseV = {
          message: "Phone Number already exists",
        };
        return responseHandler.sendSuccess(res, responseV, req);
      }

      let response = await authControls.updateUser({
        id,
        email,
        name,
        phoneNumber,
        role,
      });
      return responseHandler.sendSuccess(res, response, req);
    } catch (error) {
      return responseHandler.sendError(res, error, req);
    }
  }
);

router.delete(
  "/admin/deletebyId",
  [auth.authenticateToken, auth.checkAdmin],
  async (req, res) => {
    let { id } = req.body;

    try {
      let response = [];
      for (let i = 0; i < id.length; i++) {
        response[i] = await authControls.deleteUser({ id: id[i] });
      }
      return responseHandler.sendSuccess(res, response, req);
    } catch (error) {
      return responseHandler.sendError(res, error, req);
    }
  }
);
//#endregion

//#region User Profile
router.patch("/userProfile", [auth.authenticateToken], async (req, res) => {
  let {
    pic,
    about,
    name,
    gender,
    email,
    phoneNumber,
    password,
    profession,
    city,
    detailsJSON,
  } = req.body;
  try {
    let response;
    let userId = req.claims.user._id;
    let userProfile = await authControls.findUserProfileByUserId({ userId });
    if (userProfile) {
      response = await authControls.updateUserProfile({
        pic,
        about,
        userId,
        gender,
        detailsJSON,
      });
    } else {
      response = await authControls.addUserProfile({
        pic,
        about,
        userId,
        gender,
        detailsJSON,
      });
    }

    if (password) password = await encryptPassword(password);
    let updateUser = await authControls.updateUser({
      id: userId,
      password,
      name,
      phoneNumber,
      email,
      profession,
      city,
    });
    response = await authControls.findUserProfileByUserId({ userId });
    return responseHandler.sendSuccess(res, response, req);
  } catch (error) {
    return responseHandler.sendError(res, error, req);
  }
});

router.get("/userProfile", [auth.authenticateToken], async (req, res) => {
  try {
    let userId = req.claims.user._id;
    let response = await authControls.findUserProfileByUserId({ userId });
    return responseHandler.sendSuccess(res, response, req);
  } catch (error) {
    return responseHandler.sendError(res, error, req);
  }
});

router.get("/teacherProfile/:id", async (req, res) => {
  let { id } = req.params;
  try {
    let response = {
      teacherDetails: {},
      course: [],
      totalStudents: 0,
    };
    response.teacherDetails = await authControls.findTeacherProfileByUserId({
      id,
    });
    response.course = await courseControls.getTeacherCourseList(id);
    for (let i = 0; i < response.course.length; i++) {
      console.log(response.course[i]._id);
      let countX = await courseControls.userCourseCountByCourseId(
        response.course[i]._id
      );
      if (countX.length)
        response.totalStudents = response.totalStudents + countX[0].count;
    }
    return responseHandler.sendSuccess(res, response, req);
  } catch (error) {
    return responseHandler.sendError(res, error, req);
  }
});
//#endregion

//#region UserActivity
router.post("/userActivity", async (req, res) => {
  try {
    let response = await authControls.userActivity(req.body);
    return responseHandler.sendSuccess(res, response, req);
  } catch (error) {
    return responseHandler.sendError(res, error, req);
  }
});

router.post(
  "/getUserActivity",
  [auth.authenticateToken, auth.checkInstructor],
  async (req, res) => {
    try {
      let { groupBy, startDate, endDate, filter } = req.body;
      let response = await authControls.getUserActivity(
        startDate,
        endDate,
        filter
      );
      if (groupBy == "M") {
        response = _.groupBy(response, function (item) {
          return item.createdAt.toISOString().substring(0, 7);
        });
      } else if (groupBy == "Y") {
        response = _.groupBy(response, function (item) {
          return item.createdAt.toISOString().substring(0, 4);
        });
      } else {
        response = _.groupBy(response, function (item) {
          return item.createdAt.toISOString().substring(0, 10);
        });
      }
      return responseHandler.sendSuccess(res, response, req);
    } catch (error) {
      return responseHandler.sendError(res, error, req);
    }
  }
);
//#endregion

module.exports = router;
