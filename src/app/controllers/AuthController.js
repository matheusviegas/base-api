const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth");
const crypto = require("crypto");
const mailer = require("../../modules/mailer");

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400
    });
}

class AuthController {

    async register(req, res) {
        try {
            if (await User.findOne({ email: req.body.email })) {
                return res.status(400).send({ error: 'User already exists.' });
            }

            const user = await User.create(req.body);
            user.password = undefined;

            return res.json({
                user,
                token: generateToken({ id: user._id })
            });
        } catch (error) {
            return res.status(400).send({ error: 'Registration Failed.' });
        }
    }

    async authenticate(req, res) {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email }).select("+password");

        if (!user) {
            return res.status(400).send({ error: 'User not found.' });
        }

        if (!await bcrypt.compare(password, user.password)) {
            return res.status(400).send({ error: 'Invalid credentials.' });
        }

        user.password = undefined;

        res.json({
            user,
            token: generateToken({ id: user._id })
        });
    }

    async forgotPassword(req, res) {
        try {
            const { email } = req.body;

            const user = await User.findOne({ email })

            if (!user) {
                return res.status(400).send({ error: 'User not found.' });
            }

            const token = crypto.randomBytes(20).toString("hex");

            const now = new Date();
            now.setHours(now.getHours() + 1);

            await User.findByIdAndUpdate(user.id, {
                "$set": {
                    passwordResetToken: token,
                    passwordResetExpires: now
                }
            });

            mailer.sendMail({
                to: email,
                from: "admin@gmail.com",
                template: "auth/forgot_password",
                context: {
                    token
                }
            }, (error) => {
                if (error) {
                    return res.status(400).send({ error: "Cannot send password recovery email." })
                }

                return res.send();
            });

        } catch (error) {
            return res.status(400).send({ error: "Error on forgot password." })
        }
    }

    async resetPassword(req, res) {
        const { email, token, password } = req.body;

        try {
            const user = await User.findOne({ email }).select("+passwordResetToken passwordResetExpires");

            if (!user) {
                return res.status(400).send({ error: 'User not found.' });
            }

            if (token !== user.passwordResetToken) {
                return res.status(400).send({ error: "Invalid token." });
            }

            const now = new Date();

            if (now > user.passwordResetExpires) {
                return res.status(400).send({ error: "Token expired." })
            }

            user.password = password;

            await user.save();

            return res.send();
        } catch (error) {
            return res.status(400).send({ error: "Cannot reset password." })
        }
    }

    async refreshToken(req, res) {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(400).send({ error: 'User not found.' });
        }

        user.password = undefined;

        res.json({
            user,
            token: generateToken({ id: user._id })
        });
    }
}

module.exports = new AuthController();
