const CartItem = require("../models/cartItem");

//#endregion CartItem
const addCartItem = async (params) => {
  return CartItem.create(params);
};

const getCartItemExist = async (userId, courseId) => {
  let query = { isDeleted: false };
  query.userId = userId;
  query.courseId = courseId;
  return CartItem.find(query);
};

const getCartItem = async (userId) => {
  let query = { isDeleted: false };
  query.userId = userId;
  return CartItem.find(query).populate(
    "courseId",
    "id name media icon shortdescription tags meta batch basePrice totalPrice coursetype createdBy"
  );
};

const updateCartItem = async (id, batchType, startDate) => {
  let query = {};
  let update = {};
  let options = { new: true };
  query._id = id;
  update.batchType = batchType;
  update.startDate = startDate;
  return CartItem.findOneAndUpdate(query, update, options);
};

const deleteCartItem = async (id, userId) => {
  let query = {};
  let update = {};
  let options = { new: true };
  query._id = id;
  query.userId = userId;
  update.isDeleted = true;
  return CartItem.findOneAndUpdate(query, update, options);
};

const deleteCartItemByCourseId = async (courseId, userId) => {
  console.log("courseId :: ", courseId , userId);
  let query = {};
  let update = {};
  let options = { new: true };
  query.courseId = courseId;
  query.userId = userId;
  update.isDeleted = true;
  return CartItem.findOneAndUpdate(query, update, options);
};

const deleteByCourseId = async (courseId) => {
  let query = {};
  let update = {};
  let options = { new: true };
  query.courseId = courseId;
  update.isDeleted = true;
  return CartItem.updateMany(query, update, options);
};
//#region

module.exports = {
  addCartItem,
  updateCartItem,
  getCartItem,
  getCartItemExist,
  deleteCartItem,
  deleteCartItemByCourseId,
  deleteByCourseId
};
