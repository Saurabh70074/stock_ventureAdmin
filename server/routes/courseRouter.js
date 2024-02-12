const express = require("express");
const router = express.Router();
const axios = require("axios");
var _ = require("lodash");

const courseControls = require("../controllers/courseControls");
const cartControls = require("../controllers/cartControls");
const discountControls = require("../controllers/discountControls");
const { addBlog } = require("../validators/blogValidator");
const auth = require("../middlewares/auth");
const responseHandler = require("../utils/responseHandler");
const customExceptions = require("../responseModels/customExceptions");
const {
  ORDER_STATUS,
  COUPON_TYPE,
  STATUS,
} = require("../constants/dbConstants");

const PaytmChecksum = require("paytmchecksum");
let merchantKey = "688qGGj4#0yTcFuq";

//#region Course
router.post("/admin/add", [auth.authenticateToken, auth.checkInstructor], async (req, res) => {
  let {
    name,
    media,
    icon,
    meta,
    shortdescription,
    features,
    description,
    objective,
    curriculum,
    requirements,
    tags,
    status,
    coursetype,
    basePrice,
    totalPrice,
    batch,
    referalCredit,
    courseId,
  } = req.body;
  try {
    let createdBy = req.claims.user._id;
    let response = await courseControls.addCourseAdmin({
      name,
      media,
      icon,
      meta,
      shortdescription,
      features,
      description,
      objective,
      curriculum,
      requirements,
      tags,
      status,
      coursetype,
      createdBy,
      basePrice,
      totalPrice,
      batch,
      referalCredit,
      courseId,
    });
    response = await courseControls.getCourseAdminById(response._id);
    return responseHandler.sendSuccess(res, response, req);
  } catch (error) {
    return responseHandler.sendError(res, error, req);
  }
});

router.put("/admin/edit/:id", [auth.authenticateToken, auth.checkInstructorORSiteManager], async (req, res) => {
  let { id } = req.params;
  let {
    name,
    media,
    icon,
    meta,
    shortdescription,
    features,
    description,
    objective,
    curriculum,
    requirements,
    tags,
    status,
    coursetype,
    basePrice,
    totalPrice,
    batch,
    referalCredit,
  } = req.body;
  try {
    let coursedetails = await courseControls.getCourseAdminById(id);
    let createdBy = req.claims.user._id;
    let response = await courseControls.updateCourseAdmin({
      id,
      name,
      media,
      icon,
      meta,
      shortdescription,
      features,
      description,
      objective,
      curriculum,
      requirements,
      tags,
      status,
      coursetype,
      basePrice,
      totalPrice,
      batch,
      referalCredit,
    });
    response = await courseControls.getCourseAdminById(id);
    return responseHandler.sendSuccess(res, response, req);
  } catch (error) {
    return responseHandler.sendError(res, error, req);
  }
});

router.get("/getbyId/:id", async (req, res) => {
  let { id } = req.params;

  try {
    let response = await courseControls.getCourseById(id);
    return responseHandler.sendSuccess(res, response, req);
  } catch (error) {
    return responseHandler.sendError(res, error, req);
  }
});

router.get("/getbyName/:name", async (req, res) => {
  let { name } = req.params;

  try {
    let response = await courseControls.getCourseByName(name);
    return responseHandler.sendSuccess(res, response, req);
  } catch (error) {
    return responseHandler.sendError(res, error, req);
  }
});

router.get("/admin/getbyId/:id", [auth.authenticateToken, auth.checkInstructor], async (req, res) => {
  let { id } = req.params;

  try {
    let response = await courseControls.getCourseAdminById(id);
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
      response[i] = await courseControls.deleteCourse(id[i]);
      await cartControls.deleteByCourseId(id[i]);
    }
    return responseHandler.sendSuccess(res, response, req);
  } catch (error) {
    return responseHandler.sendError(res, error, req);
  }
});

router.delete(
  "/admin/deletebyId",
  [auth.authenticateToken, auth.checkInstructor],
  async (req, res) => {
    let { id } = req.body;

    try {
      let response = [];
      for (let i = 0; i < id.length; i++) {
        response[i] = await courseControls.deleteCourseAdmin(id[i]);
      }
      return responseHandler.sendSuccess(res, response, req);
    } catch (error) {
      return responseHandler.sendError(res, error, req);
    }
  }
);

router.post("/admin/list", [auth.authenticateToken, auth.checkInstructor], async (req, res) => {
  try {
    let response = await courseControls.getCourseAdminList();
    return responseHandler.sendSuccess(res, response, req);
  } catch (error) {
    return responseHandler.sendError(res, error, req);
  }
});

router.post("/list", async (req, res) => {
  try {
    let response = await courseControls.getCourseList();
    return responseHandler.sendSuccess(res, response, req);
  } catch (error) {
    return responseHandler.sendError(res, error, req);
  }
});

router.patch(
  "/admin/publish/:id",
  [auth.authenticateToken, auth.checkSuperAdmin],
  async (req, res) => {
    let { id } = req.params;
    let { status } = req.body;
    try {
      let courseAdminDetails = await courseControls.getCourseAdminById(id);
      if (STATUS.PUBLISH == status) {
        courseAdminDetails.status = STATUS.PUBLISH;
        let {
          name,
          media,
          icon,
          meta,
          shortdescription,
          features,
          description,
          objective,
          curriculum,
          requirements,
          tags,
          status,
          coursetype,
          basePrice,
          totalPrice,
          batch,
          referalCredit,
          createdBy,
        } = courseAdminDetails;

        if (courseAdminDetails?.courseId) {
          await courseControls.updateCourse({
            id: courseAdminDetails?.courseId,
            name,
            media,
            icon,
            meta,
            shortdescription,
            features,
            description,
            objective,
            curriculum,
            requirements,
            tags,
            status,
            coursetype,
            basePrice,
            totalPrice,
            batch,
            referalCredit,
          });
        } else {
          await courseControls.addCourse({
            name,
            media,
            icon,
            meta,
            shortdescription,
            features,
            description,
            objective,
            curriculum,
            requirements,
            tags,
            status,
            coursetype,
            basePrice,
            totalPrice,
            batch,
            referalCredit,
            createdBy,
          });
        }
      }
      let response = await courseControls.publishCourseById(id, status);
      return responseHandler.sendSuccess(res, response, req);
    } catch (error) {
      return responseHandler.sendError(res, error, req);
    }
  }
);

//#endregion

//#region order
router.post("/buy", [auth.authenticateToken], async (req, res) => {
  let { course, couponCode, referalId, paymentGateway, callbackURL } = req.body;
  try {
    let userId = req.claims.user._id;
    let paymentDetails = [];
    for (let i = 0; i < course.length; i++) {
      let courseDetails = await courseControls.getCourseById(course[i].id);
      paymentDetails[i] = {
        id: course[i].id,
        batchType: course[i].batchType,
        startDate: course[i].startDate || new Date(),
        name: courseDetails.name,
        totalPrice: courseDetails.totalPrice,
        referalCredit: courseDetails.referalCredit,
      };
    }

    let discountdetails = null;
    if (couponCode) {
      let discountResponse = await discountControls.getDiscountByCouponCode(
        couponCode
      );
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      if (discountResponse.expireDate >= today) {
        discountdetails = {
          couponCode: couponCode,
          couponType: discountResponse.couponType,
          discountValue: discountResponse.discountValue,
          id: discountResponse._id,
        };
      }
    }

    let totalPrice = 0;
    let referalCredit = 0;
    for (let i = 0; i < paymentDetails.length; i++) {
      totalPrice = totalPrice + paymentDetails[i].totalPrice;
      if (referalId)
        referalCredit = referalCredit + paymentDetails[i].referalCredit;
    }

    if (referalCredit > 0) {
      //!D Update
    }

    let discountPrice = totalPrice;
    if (discountdetails && discountdetails.discountValue) {
      if (discountdetails.couponType == COUPON_TYPE.Percentage) {
        discountPrice =
          totalPrice - (totalPrice * discountdetails.discountValue) / 100;
      } else {
        discountPrice = totalPrice - discountdetails.discountValue;
      }
      if (discountPrice < 0) discountPrice = 0;
    }

    let response = {
      paymentDetails,
      discountdetails,
      discountPrice,
      totalPrice,
      referalCredit,
    };

    let requestOrder = {
      totalPrice: discountPrice,
      status: ORDER_STATUS.PENDING,
      paymentDetails: response,
      userId: userId,
      couponId: null,
      referalId: null,
      referalCredit: null,
      paytmResponse: null,
    };

    let paytmDetails = null;

    if (paymentGateway) {
      requestOrder = await courseControls.placeorder(requestOrder);

      if (requestOrder.totalPrice == 0) {
        for (
          let i = 0;
          i < requestOrder?.paymentDetails?.paymentDetails?.length;
          i++
        ) {
          let usercourse = {
            batch:
              requestOrder.paymentDetails.paymentDetails[i].batchType || null,
            startDate:
              requestOrder.paymentDetails.paymentDetails[i].startDate || null,
            userId: requestOrder.userId,
            courseId: requestOrder.paymentDetails.paymentDetails[i].id,
            orderId: requestOrder._id,
          };
          await courseControls.userCourseCreate(usercourse);
        }

        let updateorderstatus = await courseControls.updateOrderStatus(
          requestOrder._id,
          ORDER_STATUS.COMPLETED,
          null
        );

        return responseHandler.sendSuccess(
          res,
          { msg: "Course Will be added soon", requestOrder },
          req
        );
      }

      var paytmParams = {};

      paytmParams.body = {
        requestType: "Payment",
        mid: "SxjTkS31667155693525",
        websiteName: "DEFAULT",
        orderId: requestOrder._id,
        callbackUrl: `${callbackURL}/${requestOrder._id}`,
        txnAmount: {
          value: requestOrder.totalPrice,
          currency: "INR",
        },
        userInfo: {
          custId: userId,
        },
      };

      let checksum = await PaytmChecksum.generateSignature(
        JSON.stringify(paytmParams.body),
        merchantKey
      );

      paytmParams.head = {
        signature: checksum,
      };
      let url = `https://securegw.paytm.in/theia/api/v1/initiateTransaction?mid=SxjTkS31667155693525&orderId=${requestOrder._id}`;
      let paytmResponse = await axios.post(url, paytmParams);
      paytmDetails = paytmResponse.data;
    }
    return responseHandler.sendSuccess(
      res,
      { requestOrder, paytmDetails },
      req
    );
  } catch (error) {
    return responseHandler.sendError(res, error, req);
  }
});

router.post("/verifyorder", async (req, res) => {
  let { orderId } = req.body;
  try {
    let paytmParams = {};

    paytmParams.body = {
      mid: "SxjTkS31667155693525",
      orderId: orderId,
    };

    let checksum = await PaytmChecksum.generateSignature(
      JSON.stringify(paytmParams.body),
      merchantKey
    );

    paytmParams.head = {
      signature: checksum,
    };
    let url = "https://securegw.paytm.in/v3/order/status";
    let paytmResponse = await axios.post(url, paytmParams);
    if (!paytmResponse) return;
    let paytmDetails = paytmResponse.data;

    let orderDetails = await courseControls.getOrderById(orderId);

    if (
      orderDetails &&
      orderDetails.status == ORDER_STATUS.PENDING &&
      paytmDetails &&
      paytmDetails.body &&
      paytmDetails.body.resultInfo
    ) {
      if (paytmDetails.body.resultInfo.resultStatus == "TXN_SUCCESS") {
        let transactionRequest = {
          orderId,
          userId: orderDetails.userId,
          status: ORDER_STATUS.COMPLETED,
          paymentDetails: paytmDetails.body,
        };
        let transactionsResponse = await courseControls.createTranstions(
          transactionRequest
        );
        let updateorderstatus = await courseControls.updateOrderStatus(
          orderId,
          ORDER_STATUS.COMPLETED,
          transactionsResponse._id
        );
        for (
          let i = 0;
          i < orderDetails?.paymentDetails?.paymentDetails?.length;
          i++
        ) {
          let usercourse = {
            batch:
              orderDetails.paymentDetails.paymentDetails[i].batchType || null,
            startDate:
              orderDetails.paymentDetails.paymentDetails[i].startDate || null,
            userId: orderDetails.userId,
            courseId: orderDetails.paymentDetails.paymentDetails[i].id,
            orderId,
          };
          await courseControls.userCourseCreate(usercourse);
          cartControls.deleteCartItemByCourseId(usercourse.courseId , usercourse.userId)
        }
      }
      if (paytmDetails.body.resultInfo.resultStatus == "TXN_FAILURE") {
        let transactionRequest = {
          orderId,
          userId: orderDetails.userId,
          status: ORDER_STATUS.FAILED,
          paymentDetails: paytmDetails.body,
        };
        let transactionsResponse = await courseControls.createTranstions(
          transactionRequest
        );
        let updateorderstatus = await courseControls.updateOrderStatus(
          orderId,
          ORDER_STATUS.FAILED,
          transactionsResponse._id
        );
      }
    }
    orderDetails = await courseControls.getOrderById(orderId);

    //!D verify payment ( if required )
    //!D check order and transaction details
    //!D update in transaction also

    //!D add in usercourse
    //!D update status order
    //!D update referal credit if any

    return responseHandler.sendSuccess(res, orderDetails, req);
  } catch (error) {
    return responseHandler.sendError(res, error, req);
  }
});

router.post("/webhook", async (req, res) => {
  console.log("webhook ::", req.body);
});

router.get("/mycourse", [auth.authenticateToken], async (req, res) => {
  try {
    let userId = req.claims.user._id;
    let response = await courseControls.mycourseList(userId);
    return responseHandler.sendSuccess(res, response, req);
  } catch (error) {
    return responseHandler.sendError(res, error, req);
  }
});

router.get(
  "/mycourseById/:usercourseId",
  [auth.authenticateToken],
  async (req, res) => {
    try {
      let { usercourseId } = req.params;

      let userId = req.claims.user._id;
      let response = await courseControls.mycourseById(usercourseId, userId);
      return responseHandler.sendSuccess(res, response, req);
    } catch (error) {
      return responseHandler.sendError(res, error, req);
    }
  }
);

router.get(
  "/mycourseStatus/:courseId",
  [auth.authenticateToken],
  async (req, res) => {
    try {
      let { courseId } = req.params;

      let userId = req.claims.user._id;
      let course = await courseControls.mycourseByCourseId(courseId, userId);
      let cart = await cartControls.getCartItemExist(userId, courseId);

      return responseHandler.sendSuccess(res, { course, cart }, req);
    } catch (error) {
      return responseHandler.sendError(res, error, req);
    }
  }
);

router.get("/order-history", [auth.authenticateToken], async (req, res) => {
  try {
    let userId = req.claims.user._id;
    let response = await courseControls.getorderList(userId);
    return responseHandler.sendSuccess(res, response, req);
  } catch (error) {
    return responseHandler.sendError(res, error, req);
  }
});

router.get(
  "/transaction-history",
  [auth.authenticateToken],
  async (req, res) => {
    try {
      let userId = req.claims.user._id;
      let response = await courseControls.getTransactionList(userId);
      return responseHandler.sendSuccess(res, response, req);
    } catch (error) {
      return responseHandler.sendError(res, error, req);
    }
  }
);

router.post(
  "/admin-user-course",
  [auth.authenticateToken, auth.checkInstructor],
  async (req, res) => {
    try {
      let { groupBy, startDate, endDate, filter } = req.body;
      let response = await courseControls.adminCourseList(
        startDate,
        endDate,
        filter
      );
      if (groupBy == "M") {
        response = _.groupBy(response, function (item) {
          return item.createdAt.toISOString().substring(0, 7);
        });
      } else if (groupBy == "Y") {
        response = _.groupBy(response, function (item) {
          return item.createdAt.toISOString().substring(0, 4);
        });
      } else {
        response = _.groupBy(response, function (item) {
          return item.createdAt.toISOString().substring(0, 10);
        });
      }
      return responseHandler.sendSuccess(res, response, req);
    } catch (error) {
      return responseHandler.sendError(res, error, req);
    }
  }
);

router.post(
  "/admin-order-history",
  [auth.authenticateToken],
  async (req, res) => {
    try {
      let { groupBy, startDate, endDate, filter } = req.body;
      let response = await courseControls.getAdminOrderList(
        startDate,
        endDate,
        filter
      );
      if (groupBy == "M") {
        response = _.groupBy(response, function (item) {
          return item.createdAt.toISOString().substring(0, 7);
        });
      } else if (groupBy == "Y") {
        response = _.groupBy(response, function (item) {
          return item.createdAt.toISOString().substring(0, 4);
        });
      } else {
        response = _.groupBy(response, function (item) {
          return item.createdAt.toISOString().substring(0, 10);
        });
      }

      return responseHandler.sendSuccess(res, response, req);
    } catch (error) {
      return responseHandler.sendError(res, error, req);
    }
  }
);

router.get(
  "/admin-transaction-history",
  [auth.authenticateToken],
  async (req, res) => {
    try {
      let response = await courseControls.getAdminTransactionList();
      return responseHandler.sendSuccess(res, response, req);
    } catch (error) {
      return responseHandler.sendError(res, error, req);
    }
  }
);

router.get("/getorderbyId/:id", async (req, res) => {
  let { id } = req.params;

  try {
    let response = await courseControls.getOrderById(id);
    return responseHandler.sendSuccess(res, response, req);
  } catch (error) {
    return responseHandler.sendError(res, error, req);
  }
});

//#endregion

module.exports = router;
