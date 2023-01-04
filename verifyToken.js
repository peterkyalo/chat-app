const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).json({ message: "Not authorized. No token" });
  }
  if (req.headers.authorization.startsWith("Bearer ")) {
    const token = req.headers.authorization.split(" ")[1]; //get the second element which is the token itself
    jwt.verify(token, process.env.JWT_SECRET, (err, decordedToken) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Not authorized. Invalid token" });
      } else {
        req.user = decordedToken; //an object with user id and user email
        next(); // this is the function after the verifyToken function
      }
    });
  }
};

module.exports = verifyToken;
