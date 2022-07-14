const router = require("express").Router();
const { auth } = require("../auth");
const endPoint = require("./admin.endPoint");
const adminController = require("./controller/admin");
router.get("/users", auth(endPoint.getAllUsers), adminController.getAllUsers);
router.patch(
  "/user/:id/role",
  auth(endPoint.changRole),
  adminController.changRole
);
router.patch(
  "/user/:id/block",
  auth(endPoint.blockUser),
  adminController.blockUser
);
module.exports = router;
