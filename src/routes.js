const express = require("express");
const authMiddleware = require("./middlewares/auth");

const routes = express.Router();

const AuthController = require("./controllers/AuthController");
const UserController = require("./controllers/UserController");

routes.use("/me", authMiddleware);

routes.post("/auth/register", AuthController.register);
routes.post("/auth/authenticate", AuthController.authenticate);

routes.get("/me", UserController.me);

routes.get("/", (req, res) => {
  return res.send("inicio");
});

module.exports = routes;
