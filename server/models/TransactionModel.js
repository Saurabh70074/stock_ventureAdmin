var mongoose = require("mongoose");
const { DB_MODEL_REF } = require("../constants/dbConstants");

const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

let Transaction;
let Schema = mongoose.Schema;
var TransactionSchema = new Schema(
  {
    s_uuid: { type: String, index: true },
    code: { type: Number, unique: true },
    status: { type: String },
    paymentGateway: { type: String, default: "paytm" },
    paymentDetails: { type: Schema.Types.Mixed },
    userId: { type: Schema.Types.ObjectId, ref: DB_MODEL_REF.USER },
    orderId: { type: Schema.Types.ObjectId, ref: DB_MODEL_REF.ORDER },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

TransactionSchema.plugin(autoIncrement.plugin, {
  model: DB_MODEL_REF.TRANSACTION,
  field: "code",
  startAt: 101,
});

module.exports = Transaction = new mongoose.model(
  DB_MODEL_REF.TRANSACTION,
  TransactionSchema
);
