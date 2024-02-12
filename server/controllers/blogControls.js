const Blog = require("../models/blogModel");
const BlogAdmin = require("../models/blogModelAdmin");
const { STATUS } = require("../constants/dbConstants");

//#endregion Blog
const addBlog = async (params) => {
  return Blog.create(params);
};

const addBlogAdmin = async (params) => {
  return BlogAdmin.create(params);
};

const updateBlog = async (params) => {
  let { id, type, title, titleUrl, titleDescription, tags, content, status } =
    params;

  let query = {};
  let update = {};
  let options = { new: true };
  query._id = id;
  update.type = type;
  update.title = title;
  update.titleUrl = titleUrl;
  update.titleDescription = titleDescription;
  update.tags = tags;
  update.content = content;
  update.status = status;

  return Blog.findOneAndUpdate(query, update, options);
};

const updateBlogAdmin = async (params) => {
  let { id, type, title, titleUrl, titleDescription, tags, content, status } =
    params;

  let query = {};
  let update = {};
  let options = { new: true };
  query._id = id;
  if (type) update.type = type;
  if (title) update.title = title;
  if (titleUrl) update.titleUrl = titleUrl;
  if (titleDescription) update.titleDescription = titleDescription;
  if (tags) update.tags = tags;
  if (content) update.content = content;
  if (status) update.status = status;

  return BlogAdmin.findOneAndUpdate(query, update, options);
};

const deleteBlog = async (id) => {
  let query = {};
  let update = {};
  let options = { new: true };
  query._id = id;
  update.isDeleted = true;
  return Blog.findOneAndUpdate(query, update, options);
};

const deleteBlogAdmin = async (id) => {
  let query = {};
  let update = {};
  let options = { new: true };
  query._id = id;
  update.isDeleted = true;
  return BlogAdmin.findOneAndUpdate(query, update, options);
};

const getBlogById = async (id) => {
  let query = { _id: id };
  return Blog.findOne(query).populate("authorId", "name profession city");
};

const getBlogAdminById = async (id) => {
  let query = { _id: id };
  return BlogAdmin.findOne(query).populate("authorId", "name profession city");
};

const getBlogByName = async (title) => {
  let query = { title: title };
  return Blog.findOne(query).populate("authorId", "name profession city");
};

const getBlogList = async () => {
  let query = { isDeleted: false };
  return Blog.find(query).populate("authorId", "id name profession city");
};

const getBlogAdminList = async () => {
  let query = { isDeleted: false };
  return BlogAdmin.find(query).populate("authorId", "id name profession city");
};

const publishBlogAdminById = async (id, status) => {
  let query = {};
  let update = {};
  let options = { new: true };
  query._id = id;
  update.status = status;

  return BlogAdmin.findOneAndUpdate(query, update, options);
};
//#region

module.exports = {
  addBlog,
  addBlogAdmin,
  updateBlog,
  updateBlogAdmin,
  deleteBlog,
  deleteBlogAdmin,
  getBlogById,
  getBlogAdminById,
  getBlogAdminList,
  getBlogList,
  publishBlogAdminById,
  getBlogByName,
};
