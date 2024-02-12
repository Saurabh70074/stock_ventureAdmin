const Faq = require("../models/faqModel");

//#endregion Faq
const addFaq = async (params) => {
  return Faq.create(params);
};

const updateFaq = async (params) => {
  let { id, question, tags, answer } = params;

  let query = {};
  let update = {};
  let options = { new: true };
  query._id = id;
  if(question) update.question = question;
  if(tags) update.tags = tags;
  if(answer) update.answer = answer;

  return Faq.findOneAndUpdate(query, update, options);
};

const deleteFaq = async (id) => {
  let query = {};
  let update = {};
  let options = { new: true };
  query._id = id;
  update.isDeleted = true;
  return Faq.findOneAndUpdate(query, update, options);
};

const getFaqList = async () => {
  let query = { isDeleted: false };
  return Faq.find(query);
};

const getFaqById = async (id) => {
  let query = { _id: id };
  return Faq.findOne(query);
};
//#region

module.exports = {
  addFaq,
  updateFaq,
  deleteFaq,
  getFaqById,
  getFaqList,
};
