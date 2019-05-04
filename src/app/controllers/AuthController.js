const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth");

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
}

module.exports = new AuthController();
