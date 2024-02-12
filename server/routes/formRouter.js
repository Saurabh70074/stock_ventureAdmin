const express = require("express");
const router = express.Router();

const formControls = require("../controllers/formControls");
const auth = require("../middlewares/auth");
const responseHandler = require("../utils/responseHandler");
const customExceptions = require("../responseModels/customExceptions");

//#region Form
router.post("/add", async (req, res) => {
  let { type, name, email, phoneNumber, details } = req.body;
  try {
    let response = await formControls.addForm({
      formtype: type,
      name,
      email,
      phoneNumber,
      content: details,
    });
    return responseHandler.sendSuccess(res, response, req);
  } catch (error) {
    return responseHandler.sendError(res, error, req);
  }
});

router.put(
  "/edit/:id",
  [auth.authenticateToken, auth.checkInstructor],
  async (req, res) => {
    let { id } = req.params;
    let { details, status } = req.body;
    try {
      let response = await formControls.updateForm({
        id,
        details,
        status,
      });
      return responseHandler.sendSuccess(res, response, req);
    } catch (error) {
      return responseHandler.sendError(res, error, req);
    }
  }
);

router.delete(
  "/deletebyId",
  [auth.authenticateToken, auth.checkInstructor],
  async (req, res) => {
    let { id } = req.body;

    try {
      let response = [];
      for (let i = 0; i < id.length; i++) {
        response[i] = await formControls.deleteForm(id[i]);
      }
      return responseHandler.sendSuccess(res, response, req);
    } catch (error) {
      return responseHandler.sendError(res, error, req);
    }
  }
);

router.post(
  "/list",
  [auth.authenticateToken, auth.checkInstructor],
  async (req, res) => {
    let { type } = req.body;
    try {
      let response = await formControls.getFormList(type);
      return responseHandler.sendSuccess(res, response, req);
    } catch (error) {
      return responseHandler.sendError(res, error, req);
    }
  }
);
//#endregion

module.exports = router;
