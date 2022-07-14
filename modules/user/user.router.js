const router = require("express").Router();
const { auth } = require("../../middlwear/auth");
const controller = require("./controller/profile");
const endPoint = require("./user.endPoint");
const validation = require("../../middlwear/validation");
const validators = require("./user.validation");
const { myMulter, fileValidation, handelME } = require("../../scrvice/multer");
router.get(
  "/profile",
  validation(validators.profile),
  auth(endPoint.displayProfile),
  controller.displayProfile
);
router.patch(
  "/profile/pic",
  myMulter("user/profile/profilePic", fileValidation.image).single("image"),
  handelME,
  validation(validators.profile),
  auth(endPoint.displayProfile),
  controller.profilePic
);

router.patch(
  "/profile/coverPic",
  myMulter("user/profile/profilePic", fileValidation.image).array("image", 3),
  handelME,
  auth(endPoint.displayProfile),
  controller.coverPic
);

router.patch(
  "/profile/password",
  validation(validators.updatePassword),
  auth(endPoint.profile),
  controller.updatePassword
);

router.patch(
  "/profile/:id/update",
  validation(validators.updateProfile),
  auth(endPoint.profile),
  controller.updateProfile
);
router.get("/profile/qrcode", auth(endPoint.profile), controller.qr);
module.exports = router;
