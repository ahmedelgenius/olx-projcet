const commentModel = require("../../../DB/model/Comment");
const productModel = require("../../../DB/model/Product");

const addComment = async (req, res) => {
  try {
    const { commentBody } = req.body;
    const { id } = req.params;
    const product = await productModel.findById(id);
    if (!product) {
      res.status(404).json({ message: "in-valid product" });
    } else {
      const newComment = new commentModel({
        commentBody,
        commentBy: req.user._id,
        productId: product._id,
      });
      const savedComment = await newComment.save();
      const savedProduct = await productModel.findByIdAndUpdate(
        product._id,
        {
          $push: { comments: savedComment._id },
        },
        { new: true }
      );
      res.status(200).json({ message: "done", savedProduct });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
const replyComment = async (req, res) => {
  try {
    const { commentBody } = req.body;
    const { id, commentID } = req.params;
    const product = await productModel.findById(id).populate({
      path: "comments",
    });
    if (!product) {
      res.status(404).json({ message: "in-valid product" });
    } else {
      const comment = await commentModel.findOne({
        productId: product._id,
        _id: commentID,
      });
      if (!comment) {
        res.status(404).json({ message: "in-valid product" });
      } else {
        const newComment = new commentModel({
          commentBody,
          commentBy: req.user._id,
          productId: product._id,
        });
        const savedComment = await newComment.save();
        await commentModel.findByIdAndUpdate(comment._id, {
          $push: { replys: savedComment._id },
        });
      }
    }
    res.status(200).json({ message: "done" });
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};

const updateComment = async (req, res) => {
  try {
    const { commentBody } = req.body;
    const { id } = req.params;
    const comment = await productModel.findByIdAndUpdate(
      id,
      {
        commentBody,
      },
      { new: true }
    );
    res.status(201).json({ message: "updated", comment });
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    await productModel.findByIdAndDelete(id);
    res.status(201).json({ message: "deleted" });
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
module.exports = {
  addComment,
  replyComment,
  updateComment,
  deleteComment,
};
