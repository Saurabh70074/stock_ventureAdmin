var mongoose = require("mongoose");
const { DB_MODEL_REF } = require("../constants/dbConstants");

const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

let Order;
let Schema = mongoose.Schema;
var OrderSchema = new Schema(
  {
    s_uuid: { type: String, index: true },
    code: { type: Number, unique: true },
    totalPrice: { type: Number },
    referalId: { type: Schema.Types.ObjectId, ref: DB_MODEL_REF.USER },
    referalCredit: { type: Number, default: 0 },
    status: { type: String },
    paymentDetails: { type: Schema.Types.Mixed },
    userId: { type: Schema.Types.ObjectId, ref: DB_MODEL_REF.USER },
    transactionId: { type: Schema.Types.ObjectId, ref: DB_MODEL_REF.TRANSACTION },
    couponId: { type: Schema.Types.ObjectId, ref: DB_MODEL_REF.DISCOUNT }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

OrderSchema.plugin(autoIncrement.plugin, {
  model: DB_MODEL_REF.ORDER,
  field: "code",
  startAt: 101,
});

module.exports = Order = new mongoose.model(DB_MODEL_REF.ORDER, OrderSchema);
