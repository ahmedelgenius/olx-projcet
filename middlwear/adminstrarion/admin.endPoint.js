const { roles } = require("../../middlwear/auth");
const endPoint = {
  getAllUsers: [roles.Admin],
  changRole: [roles.Admin],
  blockUser: [roles.Admin],
};

module.exports = endPoint;
