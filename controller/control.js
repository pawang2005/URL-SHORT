const shortid = require("shortid");
const URL = require("../model/user"); // make sure this is correct
const user = require("../model/userdata"); // make sure this is correct

async function generateShortURL(req, res) {
  const body = req.body;
  let shortId;
  const urls = await URL.find({ createdBy: req.user.id });
  const userDetails = await user.findById(req.user.id);

  if (!body.url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const customURL = body.custom;

  if (customURL) {
    // 🔐 Check custom ID globally (shortId must be unique)
    const existing = await URL.findOne({ shortId: customURL });

    if (existing) {
      return res.render("home_test", {
        data: "Id already in use",
        id: null,
        urls,
      });
    }
    shortId = customURL;
  } else {
    shortId = shortid.generate();
  }

  try {
    await URL.create({
      shortId: shortId,
      redirectURL: body.url,
      visitHistory: [],
      createdBy: req.user.id, // 🔗 LINK URL TO USER
      username: userDetails.name,
    });
  } catch (err) {
    return res.status(500).json({ error: "Database error" });
  }

  // 🔐 Fetch updated URLs ONLY for logged-in user
  const urls_final = await URL.find({ createdBy: req.user.id });

  res.render("home_test", {
    id: shortId,
    urls: urls_final,
    data: "",
  });
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;

  // 🔐 Ensure user owns the URL
  const result = await URL.findOne({
    shortId,
    createdBy: req.user.id,
  });

  if (!result) {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

async function handleRedirect(req, res) {
  const shortId = req.params.shortId;

  const entry = await URL.findOne({ shortId });

  if (!entry) {
    return res.status(404).send("Short URL not found");
  }

  entry.visitHistory.push({ timestamp: Date.now() });
  await entry.save();

  res.redirect(entry.redirectURL);
}

module.exports = {
  generateShortURL,
  handleGetAnalytics,
  handleRedirect,
};
