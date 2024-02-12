var mongoose = require("mongoose");
const { DB_MODEL_REF, STATUS } = require("../constants/dbConstants");

const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

let BlogAdmin;
let Schema = mongoose.Schema;
var blogadminSchema = new Schema(
  {
    s_uuid: { type: String, index: true },
    code: { type: Number, unique: true },
    type: { type: String },
    title: { type: String },
    titleUrl: { type: String },
    titleDescription: { type: String },
    tags: { type: Schema.Types.Mixed },
    content: { type: Schema.Types.Mixed },
    authorId: { type: Schema.Types.ObjectId, ref: DB_MODEL_REF.USER },
    blogId: { type: Schema.Types.ObjectId, ref: DB_MODEL_REF.BLOG },
    status: {
      type: String,
      enums: [STATUS.DRAFT, STATUS.SENDFORAPPROVAL, STATUS.PUBLISH],
      default: STATUS.DRAFT,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

blogadminSchema.plugin(autoIncrement.plugin, {
  model: DB_MODEL_REF.BLOG_ADMIN,
  field: "code",
  startAt: 101,
});

module.exports = BlogAdmin = new mongoose.model(
  DB_MODEL_REF.BLOG_ADMIN,
  blogadminSchema
);
