require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const { genUserObj, auth } = require("./middlewares/utility");
const login = require("./routers/login");
const signup = require("./routers/signup");
const test = require("./routers/test");
app.use(bodyparser.json());
app.use("/login", genUserObj, login);
app.use("/signup", genUserObj, signup);
app.use("/test", auth, test);

app.listen(process.env.SERVER_PORT, () => {
	console.log(`listening on port ${process.env.SERVER_PORT}`);
});
