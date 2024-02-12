var mongoose = require("mongoose");
const { DB_MODEL_REF, COURSE_TYPE } = require("../constants/dbConstants");

const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

let Course;
let Schema = mongoose.Schema;
var courseSchema = new Schema(
  {
    s_uuid: { type: String, index: true },
    code: { type: Number, unique: true },
    name: { type: String, unique: true, index: true },
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
    status: { type: String },
    coursetype: {
      type: String,
      enums: [COURSE_TYPE.ONLINE, COURSE_TYPE.LIVE, COURSE_TYPE.WEBINAR],
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

courseSchema.plugin(autoIncrement.plugin, {
  model: DB_MODEL_REF.COURSE,
  field: "code",
  startAt: 101,
});

module.exports = Course = new mongoose.model(DB_MODEL_REF.COURSE, courseSchema);
