const { roles } = require("../../middlwear/auth");

const endPoint = {
  addProduct: [roles.User, roles.Admin],
};

module.exports = endPoint;
