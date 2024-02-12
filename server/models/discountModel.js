var mongoose = require("mongoose");
const { DB_MODEL_REF, COUPON_TYPE } = require("../constants/dbConstants");

const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

let Discount;
let Schema = mongoose.Schema;
var discountSchema = new Schema(
  {
    s_uuid: { type: String, index: true },
    code: { type: Number, unique: true },
    couponCode: { type: String, unique: true },
    couponType: {
      type: String,
      enums: [COUPON_TYPE.Fixed, COUPON_TYPE.Percentage],
      default: COUPON_TYPE.Fixed,
    },
    discountValue: { type: Number },
    maxConsume: { type: Number, default: 1 },
    expireDate: { type: Date },
    description: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: DB_MODEL_REF.USER },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: DB_MODEL_REF.USER },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

discountSchema.plugin(autoIncrement.plugin, {
  model: DB_MODEL_REF.DISCOUNT,
  field: "code",
  startAt: 101,
});

module.exports = Discount = new mongoose.model(
  DB_MODEL_REF.DISCOUNT,
  discountSchema
);
