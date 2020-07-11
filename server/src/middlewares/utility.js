const bcrypt = require("bcrypt");
const { readFile } = require("../js/utility");
const jwt = require("jsonwebtoken");
module.exports = {
	genUserObj: async (req, res, next) => {
		if ((!req.body.username && !req.body.email) || !req.body.password) {
			return res
				.status(422)
				.json({ message: "username,email or password invalid" });
		}
		req.user = {
			_id: req.body.username,
			firstname: req.body.firstname,
			middlename: req.body.middlename,
			lastname: req.body.lastname,
			email: req.body.email,
			phone: req.body.phone,
			passHash: await bcrypt.hash(req.body.password, 10),
		};
		next();
	},
	auth: async (req, res, next) => {
		try {
			const token = req.headers.authorization.replace("Bearer ", "");
			const key = await readFile(require.resolve("../../secret/tt_rsa.pub"));
			req.payload = await jwt.verify(token, key, { algorithms: ["RS256"] });
			next();
		} catch (err) {
			console.log(err);
			return res.status(400).json({message:"invalid session"});
		}
	},
};
