const express = require("express");
const { readFile } = require("../js/utility");
const jwt = require("jsonwebtoken");
const userDB = require("../db/user");
const bcrypt = require("bcrypt");
const router = express.Router();
router.post("/", async (req, res) => {
	let status;
	let resData = {};
	try {
		const key = await readFile(require.resolve("../../secret/tt_rsa"));
		const user = req.user;
		const { data: userData, code } = await userDB.read(user._id);
		let match = true;

		if (code == 1 || userData == null) {
			match = false;
		}
		if (match) {
			match = await bcrypt.compare(req.body.password, userData.passHash);
		}
		if (!match) {
			throw { userData, code };
		} else {
			const token = await jwt.sign(user, key, { algorithm: "RS256" });
			status = 200;
			resData = { token };
		}
	} catch (err) {
		console.error(err);
		status = 400;
		resData = { message: "username or password invalid" };
	} finally {
		res.status(status).json(resData);
	}
});

module.exports = router;