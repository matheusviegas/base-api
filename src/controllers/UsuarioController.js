const Usuario = require("../models/Usuario");

class UsuarioController {
  async salvar(req, res) {
    const pacote = await Pacote.findOne({ codigo: req.params.codigo });

    const Usuario = await Usuario.create({
      local: req.body.local,
      tipo: req.body.tipo
    });

    pacote.atualizacoes.push(Usuario);

    await pacote.save();

    return res.json(Usuario);
  }

  async deletar(req, res) {
    const pacote = await Pacote.findOne({ codigo: req.params.codigo });
    pacote.atualizacoes.pull({ _id: req.params.id });
    await pacote.save();

    const Usuario = await Usuario.findById(req.params.id);
    await Usuario.remove();
    return res.send();
  }
}

module.exports = new UsuarioController();
