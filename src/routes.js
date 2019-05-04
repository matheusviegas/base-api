const express = require("express");
const authMiddleware = require("./app/middlewares/auth");

const routes = express.Router();

const AuthController = require("./app/controllers/AuthController");
const UserController = require("./app/controllers/UserController");

routes.use("/me", authMiddleware);

routes.post("/auth/register", AuthController.register);
routes.post("/auth/authenticate", AuthController.authenticate);
routes.post("/auth/forgot_password", AuthController.forgotPassword);
routes.post("/auth/reset_password", AuthController.resetPassword);

routes.get("/me", UserController.me);

routes.get("/", (req, res) => {
  return res.send("inicio");
});

module.exports = routes;
