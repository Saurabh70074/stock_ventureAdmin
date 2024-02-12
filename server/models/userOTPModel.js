var mongoose = require("mongoose");
const { DB_MODEL_REF } = require("../constants/dbConstants");

const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

let UserOtp;
let Schema = mongoose.Schema;
var userOtpSchema = new Schema(
  {
    s_uuid: { type: String, index: true },
    code: { type: Number, unique: true },
    type: { type: String },
    otp: { type: String },
    phoneNumberOrEmail: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

userOtpSchema.plugin(autoIncrement.plugin, {
  model: DB_MODEL_REF.USER_OTP,
  field: "code",
  startAt: 101,
});

module.exports = UserOtp = new mongoose.model(
  DB_MODEL_REF.USER_OTP,
  userOtpSchema
);
