const { roles } = require("../../middlwear/auth");

const endPoint = {
  displayProfile: [roles.Admin, roles.User, roles.Hr],
};

module.exports = endPoint;
