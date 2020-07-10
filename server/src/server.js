require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const app = express();

app.use(bodyparser.json());

const login = require("./routers/login");
app.use("/login", login);
app.listen(process.env.SERVER_PORT, () => {
    console.log(`listening on port ${process.env.SERVER_PORT}`);
});
