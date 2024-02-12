const Content = require("../models/contentModel");

//#region Content
const addContent = async (params) => {
  return Content.create(params);
};

const updateContent = async (params) => {
  let { contenttype, contentAdmin, status, id, content } = params;

  let query = {};
  let update = {};
  let options = { new: true };
  query._id = id;
  if (contenttype) update.contenttype = contenttype;
  if (contentAdmin) update.contentAdmin = contentAdmin;
  if (content) update.content = content;
  if (status) update.status = status;

  return Content.findOneAndUpdate(query, update, options);
};

const deleteContent = async (id, createdBy) => {
  let query = {};
  let update = {};
  let options = { new: true };
  query._id = id;
  update.isDeleted = true;
  return Content.findOneAndUpdate(query, update, options);
};

const getContentById = async (id) => {
  let query = { _id: id };
  return Content.findOne(query);
};

const getContentByContentType = async (contenttype) => {
  let query = { contenttype: contenttype };
  return Content.findOne(query);
};

const getContentList = async (createdBy = null) => {
  let query = { isDeleted: false };
  return Content.find(query);
};

//#endregion

module.exports = {
  addContent,
  updateContent,
  deleteContent,
  getContentById,
  getContentList,
  getContentByContentType,
};
