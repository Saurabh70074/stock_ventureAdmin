const Form = require("../models/formModel");

//#endregion addForm
const addForm = async (params) => {
  return Form.create(params);
};

const getFormList = async (type) => {
  let query = { formtype: type, isDeleted: false };
  return Form.find(query);
};
const updateForm = async (params) => {
  let { id, details, status } = params;

  let query = {};
  let update = {};
  let options = { new: true };
  query._id = id;
  if (details) update.content = details;
  if (status) update.status = status;

  return Form.findOneAndUpdate(query, update, options);
};

const deleteForm = async (id) => {
  let query = {};
  let update = {};
  let options = { new: true };
  query._id = id;
  update.isDeleted = true;
  return Form.findOneAndUpdate(query, update, options);
};

//#region

module.exports = {
  addForm,
  updateForm,
  deleteForm,
  getFormList,
};
