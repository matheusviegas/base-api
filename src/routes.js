const express = require("express");
require("express-group-routes");
const authMiddleware = require("./app/middlewares/auth");

const routes = express.Router();

const AuthController = require("./app/controllers/AuthController");
const UserController = require("./app/controllers/UserController");

routes.group("/auth", (router) => {
  router.post("/register", AuthController.register);
  router.post("/authenticate", AuthController.authenticate);
  router.post("/forgot_password", AuthController.forgotPassword);
  router.post("/reset_password", AuthController.resetPassword);
  router.post("/refresh_token", authMiddleware, AuthController.refreshToken);
})

routes.group("/api/v1", (router) => {
  router.use(authMiddleware);
  router.get("/me", UserController.me);
});

routes.get("/", (req, res) => {
  return res.send("inicio");
});

module.exports = routes;
