const userModel = require("../../../DB/model/User");
const sendEmail = require("../../../scrvice/sendEmail");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const signup = async (req, res) => {
  try {
    const { firstName, lastName, password, email } = req.body;

    const creacteUser = new userModel({ firstName, lastName, password, email });

    const saveUser = await creacteUser.save();
    const token = jwt.sign(
      { id: saveUser._id },
      process.env.emailTokenSecreat,
      { expiresIn: 5 * 60 }
    );

    const url2 = `${req.protocol}://${req.headers.host}/api/v1/auth/reSendToken/${token}`;
    const URL = `${req.protocol}://${req.headers.host}/api/v1/auth/confirmEmail/${saveUser._id}`;
    const message = `<a href='${URL}'>plz follow me to confirm your email </a></br> <a href='${url2}'>refresh token</a>`;
    await sendEmail(saveUser.email, message);
    console.log(saveUser);
    res.status(201).json({ message: "done", saveUser });
  } catch (error) {
    if (error.keyValue?.email) {
      res.status(409).json({ message: "email exist" });
    } else {
      res.status(500).json({ message: "error", error });
    }
  }
};
const reSendToken = async (req, res) => {
  const { id } = req.params;
  const user = await userModel.findById(id);
  if (!user) {
    res.status(400).json({ message: "in-valid account" });
  } else {
    if (user.confirmEmail) {
      res.status(409).json({ message: "already confirmed" });
    } else {
      const token = jwt.sign(
        { id: saveUser._id },
        process.env.emailTokenSecreat,
        { expiresIn: 2 * 60 }
      );
      const url2 = `${req.protocol}://${req.headers.host}/api/v1/auth/reSendToken/${token}`;
      const URL = `${req.protocol}://${req.headers.host}/api/v1/auth/confirmEmail/${user._id}`;
      const message = `<a href='${URL}'>plz follow me to confirm your email </a></br> <a href='${url2}'>refresh token</a>`;

      sendEmail(user.email, message);
      res.status(200).json({ message: "done plz check u email now" });
    }
  }
};
const confirmEmail = async (req, res) => {
  try {
    const token = req.params.token;
    console.log(token);
    const decoded = jwt.verify(token, process.env.emailTokenSecreat);
    if (!decoded) {
      res.status(400).json({ message: "in-vaild decoded token" });
    } else {
      const findUser = await userModel
        .findById(decoded.id)
        .select("confirmEmail");
      if (!findUser) {
        res.status(400).json({ message: "in-vaild account" });
      } else {
        if (findUser.confirmEmail) {
          res
            .status(400)
            .json({ message: "account already confirmed plz login" });
        } else {
          const updateUser = await userModel.findOneAndUpdate(
            { _id: findUser._id },
            { confirmEmail: true },
            { new: true }
          );
          res.status(200).json({ message: "confirmed success plz login" });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      console.log(user);
      res.status(404).json({ message: "in-valid user email " });
    } else {
      // if (!user.confirmEmail) {
      //   res.status(400).json({ message: "plz confirm u email first" });
      // } else {
      if (user.blocked) {
        res.status(400).json({
          message:
            "sorry u canot login  as u  account have been blocked by admin",
        });
      } else {
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          res.status(404).json({ message: "in-valid account  details " });
        } else {
          const token = jwt.sign(
            { id: user._id, isLoggedIn: true },
            process.env.TokenSecreat,
            { expiresIn: "24h" }
          );

          res.status(200).json({ message: "login success", token });
        }
      }
    }
    // }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
const sendCode = async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    res.status(404).json({ message: "in-valid account" });
  } else {
    const code = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
    const message = `<p>use this code to update u password</p>:${code}`;
    await userModel.findByIdAndUpdate(user._id, { code });
    sendEmail(email, message);
    res.status(200).json({ message: "done" });
  }
};
const forgetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "in-valid account" });
    } else {
      if (user.code.toString() != code.toString()) {
        res.status(409).json({ message: "wrong code" });
      } else {
        const hashedPassword = await bcrypt.hash(
          newPassword,
          parseInt(prcess.env.saltRound)
        );
        await userModel.findByIdAndUpdate(user._id, {
          password: hashedPassword,
          code: "",
        });
        res.status(200).json({ message: "done plz go login" });
      }
    }
  } catch (error) {
    res.status(00).json({ message: "catch error ", error });
  }
};
const deleteUser = async (req, res) => {
  const { id } = req.params;
  await userModel.findOneAndDelete({ id });
  res.status(200).json({ message: "deleted" });
};
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).json({ message: "done", users });
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
module.exports = {
  signup,
  confirmEmail,
  signin,
  reSendToken,
  sendCode,
  forgetPassword,
  getAllUsers,
  deleteUser,
};
