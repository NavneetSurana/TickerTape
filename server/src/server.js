require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const { genUserObj } = require("./middlewares/utility");
const login = require("./routers/login");
const signup = require("./routers/signup");

app.use(bodyparser.json());
app.use("/login", genUserObj, login);
app.use("/signup", genUserObj, signup);

app.listen(process.env.SERVER_PORT, () => {
	console.log(`listening on port ${process.env.SERVER_PORT}`);
});
