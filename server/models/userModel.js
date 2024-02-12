var mongoose = require("mongoose");
const {
  DB_MODEL_REF,
  USER_STATUS,
  USER_ROLE,
} = require("../constants/dbConstants");

const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

let Users;
let Schema = mongoose.Schema;
var userSchema = new Schema(
  {
    email: { type: String, unique: true, index: true },
    s_uuid: { type: String, index: true },
    code: { type: Number, unique: true },
    role: {
      type: String,
      enums: [
        USER_ROLE.Student,
        USER_ROLE.Instructor,
        USER_ROLE.SiteManager,
        USER_ROLE.Admin,
        USER_ROLE.SuperAdmin,
      ],
      default: USER_ROLE.Student,
    },
    name: { type: String },
    password: { type: String },
    phoneNumber: { type: String, unique: true },
    profession: { type: String },
    city: { type: String },
    status: {
      type: Number,
      enums: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVE],
      default: USER_STATUS.ACTIVE,
    },
    isDeleted: { type: Boolean, default: false },
    cashPoint: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

userSchema.plugin(autoIncrement.plugin, {
  model: DB_MODEL_REF.USER,
  field: "code",
  startAt: 101,
});

module.exports = Users = new mongoose.model(DB_MODEL_REF.USER, userSchema);
