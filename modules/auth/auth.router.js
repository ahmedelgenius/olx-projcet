const router = require("express").Router();
const controller = require("./controller/signup");
const validators = require("./auth.validation");
const validation = require("../../middlwear/validation");
// signup
router.post("/signup", validation(validators.signup), controller.signup);
// confirmEmail
router.get(
  "/confirmEmail/:token",
  validation(validators.confirmEmail),
  controller.confirmEmail
);
// resend email token
router.get("/reSendToken/:id", controller.reSendToken);
// login
router.post("/signin", validation(validators.signin), controller.signin);
// forget code
router.post("/sendCode", controller.sendCode);
//forget password
router.patch(
  "/forgetPassword",
  validation(validators.forgetPassword),
  controller.forgetPassword
);
// get all users
router.get("/", controller.getAllUsers);
//delete user
router.delete("/:id", controller.deleteUser);
module.exports = router;
