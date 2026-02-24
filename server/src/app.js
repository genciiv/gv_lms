const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const enrollRoutes = require("./routes/enrollRoutes");

const { notFound, errorHandler } = require("./middlewares/error");

const app = express();

app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);

app.get("/api/health", (req, res) => res.json({ ok: true, message: "API working ✅" }));

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/enroll", enrollRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;