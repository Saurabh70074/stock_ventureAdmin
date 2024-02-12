var mongoose = require("mongoose");
const { DB_MODEL_REF, COURSE_TYPE } = require("../constants/dbConstants");

const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

let CourseAdmin;
let Schema = mongoose.Schema;
var courseAdminSchema = new Schema(
  {
    s_uuid: { type: String, index: true },
    code: { type: Number, unique: true },
    name: { type: String },
    media: { type: String },
    icon: { type: String },
    meta: { type: Schema.Types.Mixed },
    shortdescription: { type: String },
    features: [{ type: String }],
    description: { type: String },
    objective: [{ type: String }],
    curriculum: [{ type: Schema.Types.Mixed }],
    requirements: [{ type: String }],
    tags: [{ type: String }],
    createdBy: { type: Schema.Types.ObjectId, ref: DB_MODEL_REF.USER },
    courseId: { type: Schema.Types.ObjectId, ref: DB_MODEL_REF.COURSE },
    status: { type: String },
    coursetype: {
      type: String,
      enums: [COURSE_TYPE.ONLINE, COURSE_TYPE.LIVE],
      default: COURSE_TYPE.ONLINE,
    },
    basePrice: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },
    referalCredit: { type: Number, default: 0 },
    batch: [{ type: Schema.Types.Mixed }],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

courseAdminSchema.plugin(autoIncrement.plugin, {
  model: DB_MODEL_REF.COURSE_ADMIN,
  field: "code",
  startAt: 101,
});

module.exports = CourseAdmin = new mongoose.model(
  DB_MODEL_REF.COURSE_ADMIN,
  courseAdminSchema
);
