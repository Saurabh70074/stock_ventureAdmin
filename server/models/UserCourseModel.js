var mongoose = require("mongoose");
const { DB_MODEL_REF } = require("../constants/dbConstants");

const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

let UserCourse;
let Schema = mongoose.Schema;
var UserCourseSchema = new Schema(
  {
    s_uuid: { type: String, index: true },
    code: { type: Number, unique: true },
    batch: { type: String },
    startDate: { type: Date },
    userId: { type: Schema.Types.ObjectId, ref: DB_MODEL_REF.USER },
    courseId: { type: Schema.Types.ObjectId, ref: DB_MODEL_REF.COURSE },
    orderId: { type: Schema.Types.ObjectId, ref: DB_MODEL_REF.ORDER },
    status: { type: String, default: "Active"  }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

UserCourseSchema.plugin(autoIncrement.plugin, {
  model: DB_MODEL_REF.USER_COURSE,
  field: "code",
  startAt: 101,
});

module.exports = UserCourse = new mongoose.model(
  DB_MODEL_REF.USER_COURSE,
  UserCourseSchema
);
