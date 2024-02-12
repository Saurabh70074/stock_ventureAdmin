var mongoose = require("mongoose");
const { DB_MODEL_REF } = require("../constants/dbConstants");

const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

let CartItem;
let Schema = mongoose.Schema;
var CartItemSchema = new Schema(
  {
    s_uuid: { type: String, index: true },
    code: { type: Number, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: DB_MODEL_REF.USER },
    courseId: { type: Schema.Types.ObjectId, ref: DB_MODEL_REF.COURSE },
    batchType: { type: String },
    startDate: { type: Date },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

CartItemSchema.plugin(autoIncrement.plugin, {
  model: DB_MODEL_REF.CARTITEM,
  field: "code",
  startAt: 101,
});

module.exports = CartItem = new mongoose.model(
  DB_MODEL_REF.CARTITEM,
  CartItemSchema
);
