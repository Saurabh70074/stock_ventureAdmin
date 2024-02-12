var mongoose = require("mongoose");
const { DB_MODEL_REF, STATUS } = require("../constants/dbConstants");

const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

let Blog;
let Schema = mongoose.Schema;
var blogSchema = new Schema(
  {
    s_uuid: { type: String, index: true },
    code: { type: Number, unique: true },
    type: { type: String },
    title: { type: String, unique: true, index: true },
    titleUrl: { type: String },
    titleDescription: { type: String },
    tags: { type: Schema.Types.Mixed },
    content: { type: Schema.Types.Mixed },
    authorId: { type: Schema.Types.ObjectId, ref: DB_MODEL_REF.USER },
    status: {
      type: String,
      enums: [STATUS.PUBLISH],
      default: STATUS.PUBLISH,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

blogSchema.plugin(autoIncrement.plugin, {
  model: DB_MODEL_REF.BLOG,
  field: "code",
  startAt: 101,
});

module.exports = Blog = new mongoose.model(DB_MODEL_REF.BLOG, blogSchema);
