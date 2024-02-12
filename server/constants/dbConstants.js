const DB_MODEL_REF = {
  USER: "user",
  UserProfile: "userProfile",
  USER_OTP: "userotp",
  BLOG: "blog",
  BLOG_ADMIN: "blogADMIN",
  FORM: "form",
  COURSE: "course",
  COURSE_ADMIN: "courseADMIN",
  DISCOUNT: "discount",
  CARTITEM: "cartitem",
  CONTENT: "content",
  FAQ: "faq",
  ORDER: "order",
  TRANSACTION: "transaction",
  USER_COURSE: "userCourse",
  USER_ACTIVITY: "userActivity",
};

const SORT_TYPES = {
  ASC: "asc",
  DESC: "desc",
};

const USER_STATUS = {
  ACTIVE: 1,
  DEACTIVE: 0,
};

const USER_ROLE = {
  Student: "student",
  Instructor: "instructor",
  SiteManager: "seoExpert",
  Admin: "admin",
  SuperAdmin: "superAdmin",
};

const COURSE_TYPE = {
  ONLINE: "recordedsession",
  LIVE: "live",
  WEBINAR: "webinar",
};

const FORM_TYPE = {
  ContactUs: "ContactUs",
  ChallengeForm: "ChallengeForm",
};

const COUPON_TYPE = {
  Fixed: "fixed",
  Percentage: "percentage",
};

const STATUS = {
  DRAFT: "DRAFT",
  SENDFORAPPROVAL: "SENDFORAPPROVAL",
  PUBLISH: "PUBLISH",
  REJECT: "REJECT",
};

const ORDER_STATUS = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  REFUNDED: "REFUNDED",
  FAILED: "FAILED",
};

const OTP_TYPE = ["login", "forgetpassword"];

module.exports = Object.freeze({
  FORM_TYPE,
  DB_MODEL_REF,
  SORT_TYPES,
  USER_STATUS,
  USER_ROLE,
  OTP_TYPE,
  COURSE_TYPE,
  COUPON_TYPE,
  STATUS,
  ORDER_STATUS,
});
