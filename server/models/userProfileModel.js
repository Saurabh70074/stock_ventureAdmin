var mongoose = require("mongoose");
const { DB_MODEL_REF } = require("../constants/dbConstants");

const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

let UserProfile;
let Schema = mongoose.Schema;
var UserProfilechema = new Schema(
  {
    s_uuid: { type: String, index: true },
    code: { type: Number, unique: true },
    pic: { type: String },
    gender: { type: String },
    about: { type: String },
    detailsJSON: { type: Schema.Types.Mixed },
    userId: { type: Schema.Types.ObjectId, ref: DB_MODEL_REF.USER },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

UserProfilechema.plugin(autoIncrement.plugin, {
  model: DB_MODEL_REF.UserProfile,
  field: "code",
  startAt: 101,
});

module.exports = UserProfile = new mongoose.model(
  DB_MODEL_REF.UserProfile,
  UserProfilechema
);
