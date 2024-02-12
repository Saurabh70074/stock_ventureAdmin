const Users = require("../models/userModel");
const UserOtp = require("../models/userOTPModel");
const UserProfile = require("../models/userProfileModel");
const UserActivity = require("../models/userActivity");
const utils = require("../utils/utils");

//#region User
const addUser = async (params) => {
  return Users.create(params);
};

const updateUser = async (params) => {
  let { id, name, email, role, phoneNumber, password, profession, city } =
    params;

  let query = {};
  let update = {};
  let options = { new: true };
  query._id = id;
  if (name) update.name = name;
  if (email) update.email = email;
  if (role) update.role = role;
  if (phoneNumber) update.phoneNumber = phoneNumber;
  if (password) update.password = password;
  if (profession) update.profession = profession;
  if (city) update.city = city;

  return Users.findOneAndUpdate(query, update, options);
};

const deleteUser = async (params) => {
  let { id } = params;
  let query = {};
  let update = {};
  let options = { new: true };
  query._id = id;
  update.isDeleted = true;
  return Users.findOneAndUpdate(query, update, options);
};

const getUserByEmailOrPhoneNumber = async (email, phoneNumber) => {
  let query = {  };
  query["$or"] = [
    { email: email },
    { phoneNumber: phoneNumber ? phoneNumber : email },
  ];
  return Users.findOne(query);
};

const userListAdmin = async () => {
  let query = {  };
  return Users.find(query, { password: 0 });
};

const getUserById = async (id) => {
  let query = {};
  query._id = id;
  return Users.findOne(query);
};
//#endregion

//#region User Otp
const addUserOTP = async (params) => {
  return UserOtp.create(params);
};

const findUserOtpById = async (params) => {
  let { id } = params;

  let query = {};
  query._id = id;
  return UserOtp.findOne(query);
};

const findAllOTP = async () => {
  let query = {};
  query.isDeleted = false;
  return UserOtp.find(query);
};

const deleteUserOtp = async (params) => {
  let { id } = params;

  let query = {};
  let update = {};
  let options = { new: true };
  query._id = id;
  update.isDeleted = true;
  return UserOtp.findOneAndUpdate(query, update, options);
};

//#endregion

//#region User Profile
const findUserProfileByUserId = async (params) => {
  let { userId } = params;

  let query = {};
  query.userId = userId;
  return UserProfile.findOne(query).populate(
    "userId",
    "id name phoneNumber email cashPoint profession city"
  );
};

const findTeacherProfileByUserId = async (params) => {
  let { id } = params;

  let query = {};
  query.userId = id;
  return UserProfile.findOne(query).populate(
    "userId",
    "id name email profession city"
  );
};

const addUserProfile = async (params) => {
  return UserProfile.create(params);
};

const updateUserProfile = async (params) => {
  let { pic, about, userId, gender, detailsJSON } = params;

  let query = {};
  let update = {};
  let options = { new: true };
  query.userId = userId;
  update.pic = pic;
  update.about = about;
  update.gender = gender;
  update.detailsJSON = detailsJSON;

  return UserProfile.findOneAndUpdate(query, update, options);
};
//#endregion

//#region
const userActivity = async (params) => {
  return UserActivity.create(params);
};

const getUserActivity = async (startDate, endDate, filter) => {
  let { activityType, activityPage, userId, uniqueId, ipAddress } = filter;
  let query = {};
  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }
  if (activityType) {
    query.activityType = { $in: activityType };
  }
  if (activityPage) {
    query.activityPage = { $in: activityPage };
  }
  if (userId) {
    query.userId = { $in: userId };
  }
  if (uniqueId) {
    query.uniqueId = { $in: uniqueId };
  }
  if (ipAddress) {
    query.ipAddress = { $in: ipAddress };
  }
  return UserActivity.find(query).sort({ createdAt: -1 });
};
//#endregion
module.exports = {
  addUser,
  updateUser,
  deleteUser,
  getUserByEmailOrPhoneNumber,
  userListAdmin,
  addUserOTP,
  findUserOtpById,
  findAllOTP,
  deleteUserOtp,
  findUserProfileByUserId,
  addUserProfile,
  updateUserProfile,
  getUserById,
  findTeacherProfileByUserId,
  userActivity,
  getUserActivity,
};
