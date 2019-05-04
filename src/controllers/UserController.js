const User = require("../models/User");

class UserController {

    async me(req, res) {
        try {
            const user = await User.findById(req.userId);

            if (user) {
                return res.json(user);
            }

            return res.status(400).send({ error: 'User not found.' });
        } catch (error) {
            return res.status(400).send({ error: 'Search Failed.' });
        }
    }

}

module.exports = new UserController();
