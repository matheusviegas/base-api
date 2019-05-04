const express = require("express");

const routes = express.Router();

const AuthController = require("./controllers/AuthController");

routes.post("/auth/register", AuthController.register);
routes.post("/auth/authenticate", AuthController.authenticate);

routes.get("/", (req, res) => {
  return res.send("inicio");
});

module.exports = routes;
