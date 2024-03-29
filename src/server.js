const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());

mongoose.connect(
  "mongodb+srv://matheus:teste123@cluster0-hc7z3.mongodb.net/rastreamento?retryWrites=true",
  {
    useNewUrlParser: true
  }
);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("./routes"));

app.listen(process.env.PORT || 3333);
