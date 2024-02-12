var mongoose = require("mongoose");
const { DB_MODEL_REF } = require("../constants/dbConstants");

const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

let Faq;
let Schema = mongoose.Schema;
var faqSchema = new Schema(
  {
    s_uuid: { type: String, index: true },
    code: { type: Number, unique: true },
    tags: [{ type: String }],
    question: { type: String },
    answer: { type: String },
    authorId: { type: Schema.Types.ObjectId, ref: DB_MODEL_REF.USER },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

faqSchema.plugin(autoIncrement.plugin, {
  model: DB_MODEL_REF.FAQ,
  field: "code",
  startAt: 101,
});

module.exports = Faq = new mongoose.model(DB_MODEL_REF.FAQ, faqSchema);
