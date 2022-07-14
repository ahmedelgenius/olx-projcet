const dataMethod = ["body", "params", "query", "file", "headers"];
const validation = (schema) => {
  return (req, res, next) => {
    const validationErrorArr = [];
    dataMethod.forEach((key) => {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], {
          abortEarly: false,
        });
        if (validationResult.error) {
          validationErrorArr.push(validationResult.error.details);
        }
      }
    });
    if (validationErrorArr.length) {
      res.status(400).json({ message: "validation error", validationErrorArr });
    } else {
      next();
    }
  };
};

module.exports = validation;
