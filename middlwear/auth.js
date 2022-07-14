const jwt = require("jsonwebtoken");
const userModel = require("../DB/model/User");
const roles = {
  User: "User",
  Admin: "Admin",
  Hr: "HR",
};
const auth = (accessRoles) => {
  return async (req, res, next) => {
    try {
      const headerToken = req.headers["authorization"];
      if (
        !headerToken ||
        headerToken == null ||
        headerToken == undefined ||
        !headerToken.startsWith("Bearer ")
      ) {
        console.log("error here");
        res.status(403).json({ message: "in-valid header token" });
      } else {
        const token = headerToken.split(" ")[1];

        const decoded = jwt.verify(token, process.env.TokenSecreat);
        console.log(decoded);
        if (!decoded || !decoded.isLoggedIn) {
          res.status(403).json({ message: "in-valid token" });
        } else {
          const findUser = await userModel
            .findById(decoded.id)
            .select("firstName lastName email role ");
          if (!findUser) {
            res.status(404).json({ message: "in-valid user account" });
          } else {
            if (!accessRoles.includes(findUser.role)) {
              res.status(401).json({ message: "not authorized" });
            } else {
              req.user = findUser;
              next();
            }
          }
        }
      }
    } catch (error) {
      res.status(400).json({ message: "catch error", error });
    }
  };
};

module.exports = { auth, roles };
