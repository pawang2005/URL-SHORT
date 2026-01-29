const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const userData = require("./model/userdata");
const { requireAuth } = require("./requireAuth");

const cookieParser = require("cookie-parser");
const { checkForAuthentication } = require("./checkAuth.js");

require("dotenv").config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 🔍 Detect user from token (does NOT block)
app.use(checkForAuthentication("token"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));


app.get("/signin", (req, res) => {
  return res.render("signin");
});

app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const token = await userData.matchPassword(email, password);
    res.cookie("token", token);
    return res.redirect("/");
  } catch (error) {
    return res.render("signin", { error: "Invalid email or password" });
  }
});

app.get("/signup", (req, res) => {
  return res.render("signup");
});

app.post("/signup", async (req, res) => {
  const { name, password, email, date } = req.body;

  const prevUser = await userData.findOne({ email });
  if (prevUser) {
    return res.render("signup", { message: "Email Already Exists" });
  }

  await userData.create({ name, email, date, password });
  return res.redirect("/signin");
});

app.use("/", requireAuth, require("./routes/user"));

mongoose
  .connect("mongodb://localhost:27017/URL-SHORT")
  .then(() => console.log("Connected to MongoDB"))
  .catch(console.error);

app.listen(3000, () => {
  console.log("Server Started on port 3000");
});
