var passport = require("passport");

module.exports = function(app) {
  app.get("/auth/github", passport.authenticate("github"));
	app.get("/auth/github/callback",
			passport.authenticate("github", {
		successRedirect: "/"
	}));

  app.get("/", function(req, res, next) {
    if (req.isAuthenticated()) {
      // Permite que outras rotas sejam processadas
      return next();
    } else {
      // Renderiza auth.ejs
      res.render("auth");
    }
  });

  app.get("/logout", function(req, res) {
    // Exposto pelo passport
    req.logOut();
    res.redirect("/");
  });
};
