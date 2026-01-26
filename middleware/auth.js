// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User"); 

async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.active) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
}

module.exports = { authMiddleware, requireRole };