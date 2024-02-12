const { STATUS } = require("../constants/dbConstants");
const Course = require("../models/courseModel");
const CourseAdmin = require("../models/courseModelAdmin");
const Order = require("../models/OrderModel");
const Transaction = require("../models/TransactionModel");
const UserCourse = require("../models/UserCourseModel");

//#region Course
const addCourse = async (params) => {
  return Course.create(params);
};

const addCourseAdmin = async (params) => {
  return CourseAdmin.create(params);
};

const updateCourse = async (params) => {
  let {
    id,
    name,
    media,
    icon,
    meta,
    shortdescription,
    features,
    description,
    objective,
    curriculum,
    requirements,
    tags,
    status,
    coursetype,
    basePrice,
    totalPrice,
    batch,
    referalCredit,
  } = params;

  let query = {};
  let update = {};
  let options = { new: true };
  query._id = id;
  if (name) update.name = name;
  if (media) update.media = media;
  if (icon) update.icon = icon;
  if (meta) update.meta = meta;
  if (shortdescription) update.shortdescription = shortdescription;
  if (features) update.features = features;
  if (description) update.description = description;
  if (objective) update.objective = objective;
  if (curriculum) update.curriculum = curriculum;
  if (requirements) update.requirements = requirements;
  if (tags) update.tags = tags;
  if (status) update.status = status;
  if (coursetype) update.coursetype = coursetype;
  if (basePrice) update.basePrice = basePrice;
  if (totalPrice) update.totalPrice = totalPrice;
  if (batch) update.batch = batch;
  if (referalCredit) update.referalCredit = referalCredit;

  return Course.findOneAndUpdate(query, update, options);
};

const updateCourseAdmin = async (params) => {
  let {
    id,
    name,
    media,
    icon,
    meta,
    shortdescription,
    features,
    description,
    objective,
    curriculum,
    requirements,
    tags,
    status,
    coursetype,
    basePrice,
    totalPrice,
    batch,
    referalCredit,
  } = params;

  let query = {};
  let update = {};
  let options = { new: true };
  query._id = id;
  if (name) update.name = name;
  if (media) update.media = media;
  if (icon) update.icon = icon;
  if (meta) update.meta = meta;
  if (shortdescription) update.shortdescription = shortdescription;
  if (features) update.features = features;
  if (description) update.description = description;
  if (objective) update.objective = objective;
  if (curriculum) update.curriculum = curriculum;
  if (requirements) update.requirements = requirements;
  if (tags) update.tags = tags;
  if (status) update.status = status;
  if (coursetype) update.coursetype = coursetype;
  if (basePrice) update.basePrice = basePrice;
  if (totalPrice) update.totalPrice = totalPrice;
  if (batch) update.batch = batch;
  if (referalCredit) update.referalCredit = referalCredit;
  return CourseAdmin.findOneAndUpdate(query, update, options);
};

const deleteCourse = async (id) => {
  let query = {};
  let update = {};
  let options = { new: true };
  query._id = id;
  update.isDeleted = true;
  return Course.findOneAndUpdate(query, update, options);
};

const deleteCourseAdmin = async (id) => {
  let query = {};
  let update = {};
  let options = { new: true };
  query._id = id;
  update.isDeleted = true;
  return CourseAdmin.findOneAndUpdate(query, update, options);
};

const getCourseById = async (id) => {
  let query = { _id: id };
  return Course.findOne(query).populate("createdBy", "name profession city");
};

const getCourseByName = async (name) => {
  let query = { name: name };
  return Course.findOne(query).populate("createdBy", "name profession city");
};

const getCourseAdminById = async (id) => {
  let query = { _id: id };
  return CourseAdmin.findOne(query).populate(
    "createdBy",
    "name profession city"
  );
};

const getCourseList = async (createdBy = null) => {
  let query = { isDeleted: false };
  if (createdBy) query.createdBy = createdBy;
  return Course.find(query).populate("createdBy", "name profession city");
};

const getTeacherCourseList = async (createdBy = null) => {
  let query = { isDeleted: false };
  if (createdBy) query.createdBy = createdBy;
  return Course.find(query, {
    tags: 1,
    coursetype: 1,
    basePrice: 1,
    totalPrice: 1,
    referalCredit: 1,
    batch: 1,
    name: 1,
    media: 1,
    icon: 1,
    meta: 1,
    shortdescription: 1,
  });
};

const userCourseCountByCourseId = async (courseId) => {
  let query = { isDeleted: false };
  query.courseId = courseId;
  return UserCourse.aggregate([
    { $match: { courseId: courseId } },
    { $count: "count" },
  ]);
};

const getCourseAdminList = async (createdBy = null) => {
  let query = { isDeleted: false };
  if (createdBy) query.createdBy = createdBy;
  return CourseAdmin.find(query).populate("createdBy", "name profession city");
};

const publishCourseById = async (id, status) => {
  let query = {};
  let update = {};
  let options = { new: true };
  query._id = id;
  update.status = status;

  return CourseAdmin.findOneAndUpdate(query, update, options);
};
//#endregion

//#region order
const placeorder = async (params) => {
  return Order.create(params);
};

const createTranstions = async (params) => {
  return Transaction.create(params);
};

const userCourseCreate = async (params) => {
  return UserCourse.create(params);
};

const mycourseList = async (userId) => {
  let query = { userId: userId };
  return UserCourse.find(query)
    .sort({ createdAt: -1 })
    .populate(
      "courseId",
      "name media icon meta shortdescription tags coursetype"
    );
};

const mycourseById = async (usercourseId, userId) => {
  let query = { userId: userId, _id: usercourseId };
  return UserCourse.find(query).populate("courseId");
};

const mycourseByCourseId = async (courseId, userId) => {
  let query = { userId: userId, courseId: courseId };
  return UserCourse.find(query);
};

const adminCourseList = async (startDate, endDate, filter) => {
  let { courseId } = filter;
  let query = {};
  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }
  if (courseId) {
    query.courseId = { $in: courseId };
  }
  return UserCourse.find(query)
    .sort({ createdAt: -1 })
    .populate([
      {
        path: "courseId",
        select: "name media icon meta shortdescription tags",
      },
      {
        path: "userId",
        select: "name city profession email phoneNumber cashPoint",
      },
      {
        path: "orderId",
        select: "totalPrice status"
      }
    ]);
};

const getorderList = async (userId) => {
  let query = { userId: userId };
  return Order.find(query)
    .sort({ createdAt: -1 })
    .populate(
      "transactionId",
      "paymentGateway  status paymentDetails createdAt updatedAt"
    );
};

const getAdminOrderList = async (startDate, endDate, filter) => {
  let { status } = filter;
  let query = {};
  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }
  if (status) {
    query.status = { $in: status };
  }
  return Order.find(query)
    .sort({ createdAt: -1 })
    .populate(
      "transactionId",
      "paymentGateway  status paymentDetails createdAt updatedAt"
    );
};

const getTransactionList = async (userId) => {
  let query = { userId: userId };
  return Transaction.find(query).sort({ createdAt: -1 });
};

const getAdminTransactionList = async () => {
  return Transaction.find().sort({ createdAt: -1 });
};

const updateOrderStatus = async (id, status, transactionId) => {
  let query = {};
  let update = {};
  let options = { new: true };
  query._id = id;
  update.status = status;
  update.transactionId = transactionId;

  return Order.findOneAndUpdate(query, update, options);
};

const getOrderById = async (id) => {
  let query = { _id: id };
  return Order.findOne(query).populate(
    "transactionId",
    "paymentGateway  status paymentDetails createdAt updatedAt"
  );
};

const getTransactionByOrderId = async (id) => {
  let query = { orderId: id };
  return Transaction.findOne(query);
};
//#endregion

module.exports = {
  addCourse,
  addCourseAdmin,
  updateCourse,
  updateCourseAdmin,
  deleteCourse,
  deleteCourseAdmin,
  getCourseById,
  getCourseByName,
  getCourseAdminById,
  getCourseList,
  getCourseAdminList,
  publishCourseById,
  placeorder,
  getorderList,
  updateOrderStatus,
  getOrderById,
  createTranstions,
  getTransactionByOrderId,
  userCourseCreate,
  mycourseList,
  mycourseById,
  mycourseByCourseId,
  getTransactionList,
  adminCourseList,
  getAdminOrderList,
  getAdminTransactionList,
  getTeacherCourseList,
  userCourseCountByCourseId,
};
