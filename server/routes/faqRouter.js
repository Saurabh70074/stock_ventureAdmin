const express = require("express");
const router = express.Router();

const faqControls = require("../controllers/faqControls");
const auth = require("../middlewares/auth");
const responseHandler = require("../utils/responseHandler");
const customExceptions = require("../responseModels/customExceptions");

//#region Faq
router.post("/add", [auth.authenticateToken, auth.checkInstructor], async (req, res) => {
  let { question, tags, answer } = req.body;
  try {
    let authorId = req.claims.user._id;
    let response = await faqControls.addFaq({
      question,
      tags,
      answer,
      authorId,
    });
    response = await faqControls.getFaqById(response._id);
    return responseHandler.sendSuccess(res, response, req);
  } catch (error) {
    return responseHandler.sendError(res, error, req);
  }
});

router.put("/edit/:id", [auth.authenticateToken, auth.checkInstructor], async (req, res) => {
  let { id } = req.params;
  let { question, tags, answer } = req.body;
  try {
    let faqdetails = await faqControls.getFaqById(id);
    let authorId = req.claims.user._id;
    if (!faqdetails || authorId != faqdetails.authorId) throw "You cannot edit";
    let response = await faqControls.updateFaq({
      id,
      question,
      tags,
      answer,
    });
    response = await faqControls.getFaqById(id);
    return responseHandler.sendSuccess(res, response, req);
  } catch (error) {
    return responseHandler.sendError(res, error, req);
  }
});

router.delete("/deletebyId", [auth.authenticateToken, auth.checkInstructor], async (req, res) => {
  let { id } = req.body;

  try {
    let response = [];
    for (let i = 0; i < id.length; i++) {
      response[i] = await faqControls.deleteFaq(id[i]);
    }
    return responseHandler.sendSuccess(res, response, req);
  } catch (error) {
    return responseHandler.sendError(res, error, req);
  }
});

router.post("/list", async (req, res) => {
  try {
    let response = await faqControls.getFaqList();
    return responseHandler.sendSuccess(res, response, req);
  } catch (error) {
    return responseHandler.sendError(res, error, req);
  }
});

//#endregion

module.exports = router;
