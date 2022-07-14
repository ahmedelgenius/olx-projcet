const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userShchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cPassword: { type: String },
    profilePic: { type: Array },
    coverPic: { type: Array },
    qrCode: { type: String },
    confirmEmail: { type: Boolean, default: false },
    blocked: { type: Boolean, default: false },
    wishLists: { type: Array },
    isDeleted: { type: Boolean, default: false },
    role: { type: String, default: "User" },
    code: String,
  },
  { timestamps: true }
);

userShchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    parseInt(process.env.saltRound)
  );
  next();
});

userShchema.pre("findOneAndUpdate", async function (next) {
  console.log(this.model);
  console.log(this.getQuery());
  const hookData = await this.model.findOne(this.getQuery()).select("__v");
  this.set({ __v: hookData.__v + 1 });
  next();
});
const userModel = mongoose.model("User", userShchema);

module.exports = userModel;
