const bcrypt = require("bcrypt");
const User = require("../models/User");
const { signToken } = require("../utils/jwt");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "Missing fields" });

  if (!isValidEmail(email))
    return res.status(400).json({ message: "Invalid email" });

  if (password.length < 6)
    return res.status(400).json({ message: "Password must be at least 6 chars" });

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(409).json({ message: "Email already used" });

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase(),
    passwordHash,
    role: "user",
  });

  const token = signToken({ id: user._id });

  return res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Missing fields" });

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  if (user.isBlocked) return res.status(403).json({ message: "Account blocked" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken({ id: user._id });

  return res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
}

async function me(req, res) {
  return res.json({ user: req.user });
}

module.exports = { register, login, me };