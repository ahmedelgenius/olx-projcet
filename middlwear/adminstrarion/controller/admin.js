const { sendEmail } = require("nodejs-nodemailer-outlook");
const userModel = require("../../../DB/model/User");

const getAllUsers = async (req, res) => {
  const users = await userModel.find({});
  res.status(200).json({ message: "done", users });
};

const changRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const user = await userModel.findOneAndUpdate({ _id: id }, { role });
  sendEmail(user.email, `<h1> admin change y privilage to  ${role}</h1>`);
  res.status(200).json({ message: "done" });
};
const blockUser = async (req, res) => {
  const { id } = req.params;
  const user = await userModel.findOneAndUpdate({ _id: id }, { blocked: true });
  console.log(user);
  //   sendEmail(user.email, `<h1> your account has been blocked by admin</h1>`);
  res.status(200).json({ message: "done" });
};

module.exports = {
  getAllUsers,
  changRole,
  blockUser,
};
