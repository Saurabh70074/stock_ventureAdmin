const express = require("express");
const router = express.Router();
const s3 = require('../utils/s3');
const fs = require('fs');

const formControls = require("../controllers/formControls");
const auth = require("../middlewares/auth");
const responseHandler = require("../utils/responseHandler");
const customExceptions = require("../responseModels/customExceptions");

//#region Store Media
router.post("/uploadmedia", async (req, res) => {
  try {
    console.log("This is upload");
    let response = [];
    for (let i = 0; i < req.files.length; i++) {
      let data = req.files[i];
      const s3Key = `uploadmedia/${data.filename}-${data.fieldname}`;
      const s3Object = s3.putObject(
        data.mimetype,
        fs.createReadStream(data.path),
        s3Key
      );
      let s3Url = `https://stgbuck.s3.ap-south-1.amazonaws.com/${s3Key}`;
      response[i] = s3Url
    }

    return responseHandler.sendSuccess(res, response, req);
  } catch (error) {
    return responseHandler.sendError(res, error, req);
  }
});
//#endregion

module.exports = router;
