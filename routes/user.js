const express = require("express");
const router = express.Router();
const URL = require("../model/user");
const User = require("../model/userdata");
const {
  generateShortURL,
  handleGetAnalytics,
  handleRedirect,
} = require("..//controller/control");

const { requireAuth } = require("../requireAuth");

router.get("/", requireAuth, async (req, res) => {
  const urls = await URL.find({ createdBy: req.user.id });
  const user = await User.findById(req.user.id);
  res.render("home_test", {
    id: null,
    urls,
    data: "",
    username: user.name,
  });
});

router.post("/", generateShortURL);

router.get("/analytics/:shortId", handleGetAnalytics);
router.get("/:shortId", handleRedirect);
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  return res.redirect("/signin");
});

module.exports = router;
