const userModel = require("../../../DB/model/User");
const bcrypt = require("bcryptjs");
const QRCode = require("qrcode");
const displayProfile = async (req, res) => {
  try {
    const userPro = await userModel.findById(req.user._id);
    res.status(200).json({ message: "done", userPro });
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
const updateProfile = async (req, res) => {
  const { firstName, lastName, email } = req.body;
  const { id } = req.params;
  const user = await userModel.findOneAndUpdate(
    id,
    { firstName, lastName, email },
    { new: true }
  );
  res.json({ message: "done", user });
};
const coverPic = async (req, res) => {
  try {
    if (req.fileErr) {
      res.status(400).json({ message: "in-valid file type" });
    } else {
      const URLS = [];
      req.files.forEach((file) => {
        URLS.push(`${req.finalDistination}/${file.filename}`);
      });
      const user = await userModel.findByIdAndUpdate(
        req.user._id,
        {
          coverPic: URLS,
        },
        { new: true }
      );
      res.status(200).json({ message: "done", user });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
const profilePic = async (req, res) => {
  try {
    if (req.fileErr) {
      res.status(400).json({ message: "in-valid file type" });
    } else {
      const imageUrl = `${req.finalDistination}/${req.file.filename}`;
      const user = await userModel.findByIdAndUpdate(
        req.user._id,
        {
          profilePic: imageUrl,
        },
        { new: true }
      );
      res.status(200).json({ message: "done", user });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await userModel.findById(req.user._id);
    console.log(user);
    if (oldPassword == newPassword) {
      res
        .status(400)
        .json({ message: "new password cannot equal old password" });
    } else {
      const match = await bcrypt.compare(oldPassword, user.password);
      if (!match) {
        res.status(400).json({ message: "in-valid old password" });
      } else {
        const hashedPassword = await bcrypt.hash(
          newPassword,
          parseInt(process.env.saltRound)
        );
        console.log(newPassword);
        await userModel.findByIdAndUpdate(user._id, {
          password: hashedPassword,
        });

        res.status(200).json({ message: "done" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "catch error ", error });
  }
};

const qr = async (req, res) => {
  try {
    const user = await userModel
      .findOne({ _id: req.user._id })
      .select("firstName lastName email");
    // console.log(user);
    QRCode.toDataURL(
      `${req.protocol}://${req.headers.host}/user/profile/${user._id}`,
      function (err, url) {
        if (err) {
          res.status(500).json({ message: "Qr code error" });
        } else {
          res.status(200).json({ message: "done", url });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
module.exports = {
  displayProfile,
  profilePic,
  coverPic,
  updatePassword,
  qr,
  updateProfile,
};
