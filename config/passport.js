var config = require("./config")();

var passport = require("passport");
var GitHubStrategy = require("passport-github").Strategy;
var findOrCreate = require("mongoose-findorcreate");
var mongoose = require("mongoose");

module.exports = function() {
  var Usuario = mongoose.model("Usuario");

  var githubCallback = "http://" + config.domain + ":" + config.port + "/auth/github/callback";

  passport.use(new GitHubStrategy({
		clientID: config.clientID,
		clientSecret: config.clientSecret,
		callbackURL: githubCallback
	}, function(accessToken, refreshToken, profile, done) {

    Usuario.findOrCreate(
			{"login" : profile.username},
			{"nome" : profile.username},
      function(erro, usuario) {
				if(erro) {
					return done(erro);
				}
				return done(null, usuario);
			}
    );
  }));

  // Chamado apenas UMA vez e recebe o usuário do nosso
  // banco disponibilizado pelo callback da estratégia de
  // autenticação. Realizará a serialização apenas do
  // ObjectId do usuário na sessão
  passport.serializeUser(function(usuario, done) {
	  done(null, usuario._id);
	});

  // Recebe o ObjectId do usuário armazenado na sessão
  // Chamado a CADA requisição
  passport.deserializeUser(function(id, done) {
	  Usuario.findById(id).exec()
	   .then(function(usuario) {
	      done(null, usuario);
	  });
	});
};
