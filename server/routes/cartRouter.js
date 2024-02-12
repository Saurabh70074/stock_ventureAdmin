const express = require("express");
const router = express.Router();

const cartControls = require("../controllers/cartControls");
const auth = require("../middlewares/auth");
const responseHandler = require("../utils/responseHandler");
const customExceptions = require("../responseModels/customExceptions");

//#region CartItem
router.post("/add", [auth.authenticateToken], async (req, res) => {
  let { courseId, batchType, startDate } = req.body;

  try {
    let userId = req.claims.user._id;
    let dataExist = await cartControls.getCartItemExist(userId, courseId);
    let response;
    if (dataExist?.length > 0) {
      response = await cartControls.updateCartItem(
        dataExist[0]._id,
        batchType,
        startDate
      );
    } else {
      response = await cartControls.addCartItem({
        courseId,
        userId,
        batchType,
        startDate,
      });
    }
    return responseHandler.sendSuccess(res, response, req);
  } catch (error) {
    return responseHandler.sendError(res, error, req);
  }
});

router.get("/list", [auth.authenticateToken], async (req, res) => {
  try {
    let userId = req.claims.user._id;
    let response = await cartControls.getCartItem(userId);
    return responseHandler.sendSuccess(res, response, req);
  } catch (error) {
    return responseHandler.sendError(res, error, req);
  }
});

router.delete(
  "/deletebyCourseId",
  [auth.authenticateToken],
  async (req, res) => {
    let { courseId } = req.body;

    try {
      let response = [];
      let userId = req.claims.user._id;
      for (let i = 0; i < courseId.length; i++) {
        response[i] = await cartControls.deleteCartItem(courseId[i], userId);
      }
      return responseHandler.sendSuccess(res, response, req);
    } catch (error) {
      return responseHandler.sendError(res, error, req);
    }
  }
);
//#endregion

module.exports = router;
