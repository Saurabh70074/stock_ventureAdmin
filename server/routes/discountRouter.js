const express = require("express");
const router = express.Router();

const discountControls = require("../controllers/discountControls");
const auth = require("../middlewares/auth");
const responseHandler = require("../utils/responseHandler");
const customExceptions = require("../responseModels/customExceptions");
const { USER_ROLE } = require("../constants/dbConstants");

//#region Discount
router.post(
  "/add",
  [auth.authenticateToken, auth.checkInstructor],
  async (req, res) => {
    let {
      couponCode,
      couponType,
      discountValue,
      maxConsume,
      expireDate,
      description,
    } = req.body;
    try {
      let createdBy = req.claims.user._id;
      let alreadyExist = await discountControls.getDiscountByCouponCode(
        couponCode
      );
      if (alreadyExist) {
        let responseV = {
          message: "Coupon Code Already Exist",
        };
        return responseHandler.sendSuccess(res, responseV, req);
      }
      let response = await discountControls.addDiscount({
        couponCode,
        couponType,
        discountValue,
        maxConsume,
        expireDate,
        description,
        createdBy,
      });
      response = await discountControls.getDiscountById(response._id);
      return responseHandler.sendSuccess(res, response, req);
    } catch (error) {
      return responseHandler.sendError(res, error, req);
    }
  }
);

router.put(
  "/edit/:id",
  [auth.authenticateToken, auth.checkInstructor],
  async (req, res) => {
    let { id } = req.params;
    let {
      couponCode,
      couponType,
      discountValue,
      maxConsume,
      expireDate,
      description,
    } = req.body;
    try {
      let discountdetails = await discountControls.getDiscountById(id);
      let createdBy = req.claims.user._id;
      let alreadyExist = await discountControls.getDiscountByCouponCode(
        couponCode
      );
      if (alreadyExist && alreadyExist.id != id) {
        let responseV = {
          message: "Coupon Code Already Exist",
        };
        return responseHandler.sendSuccess(res, responseV, req);
      }
      // if (!discountdetails || createdBy != discountdetails.createdBy._id)
      //   throw "You cannot edit";
      let response = await discountControls.updateDiscount({
        id,
        couponCode,
        couponType,
        discountValue,
        maxConsume,
        expireDate,
        description,
      });
      response = await discountControls.getDiscountById(id);
      return responseHandler.sendSuccess(res, response, req);
    } catch (error) {
      return responseHandler.sendError(res, error, req);
    }
  }
);

router.get("/getbyId/:id", async (req, res) => {
  let { id } = req.params;

  try {
    let response = await discountControls.getDiscountById(id);
    return responseHandler.sendSuccess(res, response, req);
  } catch (error) {
    return responseHandler.sendError(res, error, req);
  }
});

router.delete(
  "/deletebyId",
  [auth.authenticateToken, auth.checkInstructor],
  async (req, res) => {
    let { id } = req.body;

    try {
      let response = [];
      let createdBy = req.claims.user._id;
      for (let i = 0; i < id.length; i++) {
        response[i] = await discountControls.deleteDiscount(id[i], createdBy);
      }
      return responseHandler.sendSuccess(res, response, req);
    } catch (error) {
      return responseHandler.sendError(res, error, req);
    }
  }
);

router.post("/list",[auth.authenticateToken, auth.checkInstructor], async (req, res) => {
  try {
    let response = await discountControls.getDiscountList();
    return responseHandler.sendSuccess(res, response, req);
  } catch (error) {
    return responseHandler.sendError(res, error, req);
  }
});

//#endregion

module.exports = router;
