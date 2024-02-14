const express = require("express");
const router = express.Router();
const s3 = require('../utils/s3');
const fs = require('fs');
const multer = require('multer');

const formControls = require("../controllers/formControls");
const auth = require("../middlewares/auth");
const responseHandler = require("../utils/responseHandler");
const customExceptions = require("../responseModels/customExceptions");

// Multer configuration for handling file uploads
const upload = multer({ dest: 'uploads/' }); // Destination folder for temporarily storing uploaded files

//#region Store Media
router.post("/uploadmedia", upload.single('video'), async (req, res) => {
  try {
    console.log("This is upload");
    
    if (!req.file) {
      throw new customExceptions.BadRequestException("No file uploaded");
    }
    
    // Constructing S3 object key
    const s3Key = `uploadmedia/${req.file.filename}`;

    // Uploading file to S3
    const params = {
      Bucket: process.env.S3BUCKETNAME,
      Key: s3Key,
      Body: fs.createReadStream(req.file.path),
      ContentType: 'video/mp4' // Set the content type accordingly
    };

    const s3Object = await s3.upload(params).promise(); // Using AWS SDK method to upload object to S3

    // Generating S3 URL
    const s3Url = s3Object.Location;

    // Sending success response
    return responseHandler.sendSuccess(res, { s3Url }, req);
  } catch (error) {
    // Sending error response
    return responseHandler.sendError(res, error, req);
  }
});
//#endregion

module.exports = router;
