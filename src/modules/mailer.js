const path = require("path");
const nodemailer = require("nodemailer");
const handlebars = require("nodemailer-express-handlebars");

const { host, port, user, pass } = require("../config/mail");

const transport = nodemailer.createTransport({
    host,
    port,
    auth: {
        user,
        pass
    }
});

const opt = {
    viewEngine: {
        extName: '.html',
        partialsDir: path.resolve("./src/resources/mail/partials"),
        layoutsDir: path.resolve("./src/resources/mail/"),
    },
    viewPath: path.resolve("./src/resources/mail/"),
    extName: '.html',
};

transport.use("compile", handlebars(opt));

module.exports = transport;