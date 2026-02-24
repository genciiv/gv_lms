const { verifyToken } = require("../utils/jwt");
const User = require("../models/User");

async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select("-passwordHash");
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (user.isBlocked) return res.status(403).json({ message: "Account blocked" });

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

async function optionalAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return next();

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select("-passwordHash");
    if (user && !user.isBlocked) req.user = user;
  } catch {
    // ignore
  }
  next();
}

function isAdmin(req, res, next) {
  if (req.user?.role !== "admin") return res.status(403).json({ message: "Admin only" });
  next();
}

module.exports = { auth, optionalAuth, isAdmin };