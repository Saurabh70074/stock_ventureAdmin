var mongoose = require("mongoose");
const { DB_MODEL_REF, STATUS } = require("../constants/dbConstants");

const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

let Content;
let Schema = mongoose.Schema;
var contentSchema = new Schema(
  {
    s_uuid: { type: String, index: true },
    code: { type: Number, unique: true },
    contenttype: { type: String, unique: true },
    contentAdmin: { type: Schema.Types.Mixed },
    content: { type: Schema.Types.Mixed },
    isDeleted: { type: Boolean, default: false },
    status: {
      type: String,
      enums: [
        STATUS.DRAFT,
        STATUS.SENDFORAPPROVAL,
        STATUS.PUBLISH,
        STATUS.REJECT,
      ],
      default: STATUS.DRAFT,
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

contentSchema.plugin(autoIncrement.plugin, {
  model: DB_MODEL_REF.CONTENT,
  field: "code",
  startAt: 101,
});

module.exports = Content = new mongoose.model(
  DB_MODEL_REF.CONTENT,
  contentSchema
);
