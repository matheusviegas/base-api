const express = require("express");
require("express-group-routes");

const routes = express.Router();

const AuthController = require("./app/controllers/AuthController");
const UserController = require("./app/controllers/UserController");

const authMiddleware = require("./app/middlewares/auth");

routes.group("/auth", (router) => {
  router.post("/register", AuthController.register);
  router.post("/authenticate", AuthController.authenticate);
  router.post("/forgot_password", AuthController.forgotPassword);
  router.post("/reset_password", AuthController.resetPassword);
  router.post("/refresh_token", authMiddleware, AuthController.refreshToken);
});

routes.group("/user", (router) => {
  router.use(authMiddleware);
  router.get("/", UserController.me);
});

module.exports = routes;
