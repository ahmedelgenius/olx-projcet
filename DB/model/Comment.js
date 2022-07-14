const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    commentBody: { type: String, required: true },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    commentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    idDeleted: { type: Boolean, default: false },
    replys: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
);

const commentModel = mongoose.model("Comment", commentSchema);
module.exports = commentModel;
