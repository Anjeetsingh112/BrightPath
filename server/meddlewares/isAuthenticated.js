const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated.",
        success: false,
      });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);
    if (!decode || !decode.userId) {
      return res.status(401).json({
        message: "Invalid token.",
        success: false,
      });
    }

    // If decode is successful, attach user data and proceed
    req.id = decode.userId;
    next();
  } catch (error) {
    console.log("JWT Error:", error.message);
    return res.status(401).json({
      message: "Invalid or expired token.",
      success: false,
    });
  }
};

module.exports = { isAuthenticated };
