var express = require("express");
var load = require("express-load");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var passport = require("passport");
var helmet = require("helmet");

module.exports = function() {
  var app = express();

  // Configuração de ambiente (Variável de ambiente)
  app.set("port", 3000);

  // Configuração de ambiente (template engine)
  app.set("view engine", "ejs");
  app.set("views", "./app/views");
  app.use(express.static("./public"));

  // Middlewares
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(require("method-override")());

  // Middlewares de session
  app.use(cookieParser());
  app.use(session(
    {
      secret: "homem avestruz",
      resave: true,
      saveUninitialized: true
    }
  ));

  app.use(passport.initialize());
  app.use(passport.session());

// Middlewares de segurança
app.use(helmet.xframe());
app.use(helmet.xssFilter());
app.use(helmet.nosniff());
app.disable("x-powered-by");

  // Express load
  load("models", {cwd: "app"})
    .then("controllers")
    .then("routes/auth.js")
    .then("routes")
    .into(app);

  // Se nenhuma rota atender, redireciona para a página 404
  app.get("*", function(req, res) {
    res.status(404).render("404");
  });

  return app;
};
