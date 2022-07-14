const productModel = require("../../../DB/model/Product");
const commentModel = require("../../../DB//model/Comment");
const getProducts = [
  {
    path: "createdBy",
    select: "firstName lastName email ",
  },
  {
    path: "likes",
    select: "firstName lastName email ",
  },
  {
    path: "comments",
    match: { isDeleted: false },
    populate: [
      {
        path: "commentBy",
        select: "firstName lastName email ",
      },
      {
        path: "replys",
        populate: [
          {
            path: "commentBy",
            select: "firstName lastName email ",
          },
          {
            path: "replys",
            populate: {
              path: "commentBy",
              select: "firstName lastName email ",
            },
          },
        ],
      },
    ],
  },
];
const addProduct = async (req, res) => {
  try {
    const { title, desc, price } = req.body;
    const newProduct = new productModel({
      title,
      desc,
      price,
      createdBy: req.user._id,
    });
    const savedProduct = await newProduct.save();
    res.status(201).json({ message: "done", savedProduct });
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
const likeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);
    if (!product) {
      res.status(404).json({ message: "in-valid product id " });
    } else {
      await productModel.findByIdAndUpdate(product._id, {
        $push: { likes: req.user._id },
      });
      res.status(200).json({ message: "done" });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
const unLikeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);
    if (!product) {
      res.status(404).json({ message: "in-valid product id " });
    } else {
      await productModel.findByIdAndUpdate(product._id, {
        $pull: { likes: req.user._id },
      });
      res.status(200).json({ message: "done" });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
const productList = async (req, res) => {
  try {
    const product = await productModel.find({}).populate(getProducts);

    res.status(200).json({ message: "done", product });
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { title, desc, price } = req.body;
    const { id } = req.params;
    const product = await productModel.findByIdAndUpdate(
      id,
      {
        title,
        desc,
        price,
      },
      { new: true }
    );
    res.status(201).json({ message: "done", product });
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await productModel.findByIdAndDelete(id);
    res.status(201).json({ message: "deleted" });
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};

module.exports = {
  addProduct,
  likeProduct,
  unLikeProduct,
  productList,
  updateProduct,
  deleteProduct,
};
