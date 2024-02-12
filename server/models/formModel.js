var mongoose = require("mongoose");
const { DB_MODEL_REF, FORM_TYPE } = require("../constants/dbConstants");

const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

let Forms;
let Schema = mongoose.Schema;
var formSchema = new Schema(
  {
    s_uuid: { type: String, index: true },
    code: { type: Number, unique: true },
    email: { type: String },
    formtype: {
      type: String,
      enums: [FORM_TYPE.ContactUs, FORM_TYPE.ChallengeForm],
      default: FORM_TYPE.ContactUs,
    },
    name: { type: String },
    phoneNumber: { type: String },
    content: { type: Schema.Types.Mixed },
    isDeleted: { type: Boolean, default: false },
    status: { type: String, default: "Started" },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

formSchema.plugin(autoIncrement.plugin, {
  model: DB_MODEL_REF.FORM,
  field: "code",
  startAt: 101,
});

module.exports = Forms = new mongoose.model(DB_MODEL_REF.FORM, formSchema);
