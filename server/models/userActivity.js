var mongoose = require("mongoose");
const { DB_MODEL_REF } = require("../constants/dbConstants");

const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

let UserActivity;
let Schema = mongoose.Schema;
var userActivitySchema = new Schema(
  {
    s_uuid: { type: String, index: true },
    code: { type: Number, unique: true },
    activityType: { type: String },
    activityPage: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: DB_MODEL_REF.USER },
    uniqueId: { type: Schema.Types.ObjectId },
    details: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

userActivitySchema.plugin(autoIncrement.plugin, {
  model: DB_MODEL_REF.USER_ACTIVITY,
  field: "code",
  startAt: 101,
});

module.exports = UserActivity = new mongoose.model(
  DB_MODEL_REF.USER_ACTIVITY,
  userActivitySchema
);
