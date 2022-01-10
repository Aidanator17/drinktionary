module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/auth/login");
  },
  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
    
  },
  ensureAdmin: function (req, res, next) {
    if (req.user.role == "admin" && req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
  },
};