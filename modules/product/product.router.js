const router = require("express").Router();
const { auth } = require("../../middlwear/auth");
const validation = require("../../middlwear/validation");
const controller = require("./contorller/product");
const endPoint = require("./product.endPoint");
const validators = require("./product.validation");
const commentContorller = require("./contorller/comment");
router.post(
  "/Product",
  auth(endPoint.addProduct),
  validation(validators.addProduct),
  controller.addProduct
);
router.patch(
  "/:id/like",
  validation(validators.likeProduct),
  auth(endPoint.addProduct),
  controller.likeProduct
);
router.patch(
  "/:id/unlike",
  validation(validators.likeProduct),
  auth(endPoint.addProduct),
  controller.unLikeProduct
);

// comment
router.post(
  "/:id/comment",
  validation(validators.addComment),
  auth(endPoint.addProduct),
  commentContorller.addComment
);
// reply
router.patch(
  "/:id/comment/:commentID",
  validation(validators.replyComment),
  auth(endPoint.addProduct),
  commentContorller.replyComment
);

// update comment
router.patch("/:id/comment", commentContorller.updateComment);
router.delete("/:id/comment", commentContorller.deleteComment);
// get all products
router.get("/", controller.productList);
module.exports = router;

//update product
router.patch("/:id", controller.updateProduct);

// delete product
router.delete("/:id", controller.deleteProduct);
