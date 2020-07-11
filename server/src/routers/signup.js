const express = require("express");
const { readFile } = require("../js/utility");
const jwt = require("jsonwebtoken");
const userDB = require("../db/user");
const bcrypt = require("bcrypt");
const router = express.Router();
router.post("/", async (req, res) => {
	let status;
	let resData;
	const user = req.user;
	try {
		const key = await readFile(require.resolve("../../secret/tt_rsa"));
		const { code } = await userDB.create(user);
		if (code == 1) {
			throw { code };
		} else {
			const token = await jwt.sign(user, key, { algorithm: "RS256" });
			status = 200;
			resData = { token };
		}
	} catch (err) {
		console.error(err);
		status = 400;
		resData = { message: "something went wrong try again" };
		await userDB.delete(user._id);
	} finally {
		res.status(status).json(resData);
	}
});

module.exports = router;
