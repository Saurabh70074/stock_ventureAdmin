const Discount = require("../models/discountModel");

//#region Discount
const addDiscount = async (params) => {
  return Discount.create(params);
};

const updateDiscount = async (params) => {
  let {
    id,
    couponCode,
    couponType,
    discountValue,
    maxConsume,
    expireDate,
    description,
  } = params;

  let query = {};
  let update = {};
  let options = { new: true };
  query._id = id;
  if(couponCode) update.couponCode = couponCode;
  if(couponType) update.couponType = couponType;
  if(discountValue) update.discountValue = discountValue;
  if(maxConsume) update.maxConsume = maxConsume;
  if(expireDate) update.expireDate = expireDate;
  if(description) update.description = description;

  return Discount.findOneAndUpdate(query, update, options);
};

const deleteDiscount = async (id, createdBy) => {
  let query = {};
  let update = {};
  let options = { new: true };
  query._id = id;
  query.createdBy = createdBy;
  update.isDeleted = true;
  return Discount.findOneAndUpdate(query, update, options);
};

const getDiscountById = async (id) => {
  let query = { _id: id };
  return Discount.findOne(query).populate("createdBy", "name profession city");
};

const getDiscountByCouponCode = async (couponCode) => {
  let query = { couponCode: couponCode, isDeleted: false };
  return Discount.findOne(query).populate("createdBy", "name profession city");
};

const getDiscountList = async (createdBy = null) => {
  let query = { isDeleted: false };
  if (createdBy) query.createdBy = createdBy;
  return Discount.find(query);
};

//#endregion

module.exports = {
  addDiscount,
  updateDiscount,
  deleteDiscount,
  getDiscountById,
  getDiscountByCouponCode,
  getDiscountList,
};
