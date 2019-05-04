const User = require("../models/User");

class UserController {

    async find(req, res) {
        try {
            const user = await User.findById(req.userId);

            if (!user) {
                return res.status(400).send({ error: 'User not found.' });
            }

            return res.json(user);
        } catch (error) {
            return res.status(400).send({ error: 'Search Failed.' });
        }
    }

}

module.exports = new UserController();
