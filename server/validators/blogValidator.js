const customExceptions = require("../responseModels/customExceptions");

const addBlog = (req, res, next) => {
  let { type, title, titleUrl, titleDescription, tags, content, status } =
    req.body;
  let errors = [];

  if (!type) {
    let errorMessage = "Type is require";
    errors.push({ errorMessage });
  }
  if (!status) {
    let errorMessage = "Status is require";
    errors.push({ errorMessage });
  }

  if (errors.length) {
    throw next(
      customExceptions.completeCustomException(0, "Validation Error", errors)
    );
  }
  next();
};

module.exports = {
  addBlog,
};
