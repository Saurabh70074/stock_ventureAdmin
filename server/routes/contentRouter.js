const express = require("express");
const router = express.Router();

const contentControls = require("../controllers/contentControls");
const auth = require("../middlewares/auth");
const responseHandler = require("../utils/responseHandler");
const customExceptions = require("../responseModels/customExceptions");
const { USER_ROLE, STATUS } = require("../constants/dbConstants");

//#region Content
router.post("/admin/add", [auth.authenticateToken, auth.checkSiteManager], async (req, res) => {
  let { contenttype, contentAdmin, status } = req.body;
  try {
    let createdBy = req.claims.user._id;
    let response = await contentControls.addContent({
      contenttype,
      contentAdmin,
      status,
    });
    response = await contentControls.getContentById(response._id);
    return responseHandler.sendSuccess(res, response, req);
  } catch (error) {
    return responseHandler.sendError(res, error, req);
  }
});

router.put("/admin/edit/:id", [auth.authenticateToken, auth.checkSiteManager], async (req, res) => {
  let { id } = req.params;
  let { contenttype, contentAdmin, status } = req.body;
  try {
    // let contentdetails = await contentControls.getContentById(id);
    let response = await contentControls.updateContent({
      contenttype,
      contentAdmin,
      status,
      id,
    });
    response = await contentControls.getContentById(id);
    return responseHandler.sendSuccess(res, response, req);
  } catch (error) {
    return responseHandler.sendError(res, error, req);
  }
});

router.get("/getbyId/:id", async (req, res) => {
  let { id } = req.params;
  try {
    let response = await contentControls.getContentById(id);
    return responseHandler.sendSuccess(res, response, req);
  } catch (error) {
    return responseHandler.sendError(res, error, req);
  }
});

router.get("/getbyContentType/:contenttype", async (req, res) => {
  let { contenttype } = req.params;
  try {
    let response = await contentControls.getContentByContentType(contenttype);
    return responseHandler.sendSuccess(res, response, req);
  } catch (error) {
    return responseHandler.sendError(res, error, req);
  }
});

router.delete(
  "/admin/deletebyId",
  [auth.authenticateToken, auth.checkSiteManager],
  async (req, res) => {
    let { id } = req.body;

    try {
      let response = [];

      for (let i = 0; i < id.length; i++) {
        response[i] = await contentControls.deleteContent(id[i]);
      }
      return responseHandler.sendSuccess(res, response, req);
    } catch (error) {
      return responseHandler.sendError(res, error, req);
    }
  }
);

router.post("/admin/list", [auth.authenticateToken, auth.checkSiteManager], async (req, res) => {
  try {
    let response = await contentControls.getContentList();
    return responseHandler.sendSuccess(res, response, req);
  } catch (error) {
    return responseHandler.sendError(res, error, req);
  }
});

// , auth.checkAdmin
router.patch(
  "/admin/publish/:id",
  [auth.authenticateToken, auth.checkSuperAdmin],
  async (req, res) => {
    let { id } = req.params;
    let { status } = req.body;

    try {
      let contentdetails = await contentControls.getContentById(id);
      let response = null;
      if (STATUS.PUBLISH == status) {
        response = await contentControls.updateContent({
          content: contentdetails.contentAdmin,
          contentAdmin: null,
          status,
          id,
        });
      } else {
        response = await contentControls.updateContent({
          status,
          id,
        });
      }

      return responseHandler.sendSuccess(res, response, req);
    } catch (error) {
      return responseHandler.sendError(res, error, req);
    }
  }
);

//#endregion

module.exports = router;
