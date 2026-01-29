function requireAuth(req, res, next) {
  if (!req.user) {
    return res.redirect("/signin");
  }
  next();
}

module.exports = { requireAuth };
