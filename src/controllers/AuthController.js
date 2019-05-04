const User = require("../models/User");

class AuthController {
    async register(req, res) {
        try {
            const user = await User.create(req.body);
            return res.json(user);
        } catch (error) {
            return res.status(400).send({ error: 'Registration Failed.' });
        }
    }

    async authenticate(req, res) {
        const pacote = await Pacote.findOne({ codigo: req.params.codigo });
        pacote.atualizacoes.pull({ _id: req.params.id });
        await pacote.save();

        const User = await User.findById(req.params.id);
        await User.remove();
        return res.send();
    }
}

module.exports = new AuthController();
