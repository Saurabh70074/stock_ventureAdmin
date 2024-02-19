const express = require("express");
const router = express.Router();

const blogControls = require("../controllers/blogControls");
const { addBlog } = require("../validators/blogValidator");
const auth = require("../middlewares/auth");
const responseHandler = require("../utils/responseHandler");
const customExceptions = require("../responseModels/customExceptions");
const { STATUS } = require("../constants/dbConstants");

//#region Blog

// [auth.authenticateToken, auth.checkSiteManager, addBlog]
router.post(
  "/admin/add",[auth.authenticateToken, auth.checkSiteManager, addBlog],
  async (req, res) => {
    let {
      type,
      title,
      titleUrl,
      titleDescription,
      tags,
      content,
      status,
      blogId,
    } = req.body;
    try {
      let authorId = req.claims.user?._id;
      let response = await blogControls.addBlogAdmin({
        type,
        title,
        titleUrl,
        titleDescription,
        tags,
        content,
        status,
        authorId,
        blogId,
      });
      response = await blogControls.getBlogAdminById(response._id);
      return responseHandler.sendSuccess(res, response, req);
    } catch (error) {
      return responseHandler.sendError(res, error, req);
    }
  }
);

router.put(
  "/admin/edit/:id",
  [auth.authenticateToken, auth.checkSiteManager, addBlog],
  async (req, res) => {
    let { id } = req.params;
    let { type, title, titleUrl, titleDescription, tags, content, status } =
      req.body;
    try {
      let blogdetails = await blogControls.getBlogAdminById(id);
      let authorId = req.claims.user._id;
      let response = await blogControls.updateBlogAdmin({
        id,
        type,
        title,
        titleUrl,
        titleDescription,
        tags,
        content,
        status,
      });
      response = await blogControls.getBlogAdminById(id);
      return responseHandler.sendSuccess(res, response, req);
    } catch (error) {
      return responseHandler.sendError(res, error, req);
    }
  }
);

router.get("/getbyId/:id", async (req, res) => {
  let { id } = req.params;

  try {
    let response = await blogControls.getBlogById(id);
    return responseHandler.sendSuccess(res, response, req);
  } catch (error) {
    return responseHandler.sendError(res, error, req);
  }
});

router.get("/getbyName/:name", async (req, res) => {
  let { name } = req.params;

  try {
    let response = await blogControls.getBlogByName(name);
    return responseHandler.sendSuccess(res, response, req);
  } catch (error) {
    return responseHandler.sendError(res, error, req);
  }
});

router.get(
  "/admin/getbyId/:id",
  [auth.authenticateToken, auth.checkSiteManager],
  async (req, res) => {
    let { id } = req.params;

    try {
      let response = await blogControls.getBlogAdminById(id);
      return responseHandler.sendSuccess(res, response, req);
    } catch (error) {
      return responseHandler.sendError(res, error, req);
    }
  }
);

router.delete(
  "/deletebyId",
  [auth.authenticateToken, auth.checkSiteManager],
  async (req, res) => {
    let { id } = req.body;

    try {
      let response = [];
      for (let i = 0; i < id.length; i++) {
        response[i] = await blogControls.deleteBlog(id[i]);
      }
      return responseHandler.sendSuccess(res, response, req);
    } catch (error) {
      return responseHandler.sendError(res, error, req);
    }
  }
);

router.delete(
  "/admin/deletebyId",
  [auth.authenticateToken, auth.checkSiteManager],
  async (req, res) => {
    let { id } = req.body;

    try {
      let response = [];
      for (let i = 0; i < id.length; i++) {
        response[i] = await blogControls.deleteBlogAdmin(id[i]);
      }
      return responseHandler.sendSuccess(res, response, req);
    } catch (error) {
      return responseHandler.sendError(res, error, req);
    }
  }
);

router.post("/list", async (req, res) => {
  try {
    let response = await blogControls.getBlogList();
    return responseHandler.sendSuccess(res, response, req);
  } catch (error) {
    return responseHandler.sendError(res, error, req);
  }
});

router.post(
  "/admin/list",
  [auth.authenticateToken, auth.checkSiteManager],
  async (req, res) => {
    try {
      let response = await blogControls.getBlogAdminList();
      return responseHandler.sendSuccess(res, response, req);
    } catch (error) {
      return responseHandler.sendError(res, error, req);
    }
  }
);

// , auth.checkAdmin
router.patch(
  "/admin/publish/:id",
  [auth.authenticateToken, auth.checkSuperAdmin],
  async (req, res) => {
    let { id } = req.params;
    let { status } = req.body;

    try {
      let getAdminDetails = await blogControls.getBlogAdminById(id);
      if (STATUS.PUBLISH == status) {
        getAdminDetails.status = STATUS.PUBLISH;
        let {
          type,
          title,
          titleUrl,
          titleDescription,
          tags,
          content,
          status,
          blogId,
          authorId,
        } = getAdminDetails;
        console.log("getAdminDetails ::", getAdminDetails);
        if (getAdminDetails?.blogId) {
          await blogControls.updateBlog({
            type,
            title,
            titleUrl,
            titleDescription,
            tags,
            content,
            status,
            id: blogId,
          });
        } else {
          await blogControls.addBlog({
            type,
            title,
            titleUrl,
            titleDescription,
            tags,
            content,
            status,
            authorId,
          });
        }
      }
      let response = await blogControls.publishBlogAdminById(id, status);
      return responseHandler.sendSuccess(res, response, req);
    } catch (error) {
      return responseHandler.sendError(res, error, req);
    }
  }
);

//#endregion

module.exports = router;
